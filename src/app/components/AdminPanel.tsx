import { useState, useRef } from "react";
import {
  UserIcon,
  FolderIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  SaveIcon,
  XIcon,
  UploadIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  AwardIcon,
  BriefcaseIcon,
  FileIcon,
  ImageIcon,
  LinkIcon,
  CheckCircleIcon,
  InfoIcon,
  KeyRoundIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Profile, Project, Document, BlogPost } from "../data";
import { uploadFile } from "../../firebase/storage";
import { changeAdminPassword } from "../../firebase/auth";

interface AdminPanelProps {
  profile: Profile;
  projects: Project[];
  documents: Document[];
  blogPosts: BlogPost[];
  onProfileSave: (profile: Profile) => void;
  onProjectSave: (project: Project) => void;
  onProjectDelete: (id: string) => void;
  onDocumentAdd: (doc: Omit<Document, "id">) => void;
  onDocumentDelete: (id: string) => void;
  onBlogSave: (post: BlogPost) => void;
  onBlogDelete: (id: string) => void;
  onBack: () => void;
}

type Tab = "profile" | "projects" | "documents" | "blog";
type ImageInputMode = "url" | "file";

const docTypeOptions: { value: Document["type"]; label: string }[] = [
  { value: "certificate", label: "Certificate" },
  { value: "research", label: "Research Paper" },
  { value: "resume", label: "Resume" },
  { value: "internship", label: "Internship Report" },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function AdminPanel({
  profile,
  projects,
  documents,
  blogPosts,
  onProfileSave,
  onProjectSave,
  onProjectDelete,
  onDocumentAdd,
  onDocumentDelete,
  onBlogSave,
  onBlogDelete,
  onBack,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password change state (uses Firebase Auth)
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const handlePasswordChange = async () => {
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    setPwLoading(true);
    setPwError("");
    try {
      await changeAdminPassword(currentPw, newPw);
      setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPwError("");
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      const code = err?.code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setPwError("Current password is incorrect.");
      } else if (code === "auth/weak-password") {
        setPwError("New password is too weak. Use at least 6 characters.");
      } else {
        setPwError("Failed to change password. Please try again.");
      }
    } finally {
      setPwLoading(false);
    }
  };

  const [imageMode, setImageMode] = useState<ImageInputMode>("url");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadPct, setImageUploadPct] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [docForm, setDocForm] = useState<Omit<Document, "id">>({
    type: "certificate",
    title: "",
    description: "",
    fileUrl: "",
    date: "",
    issuer: "",
  });
  const [docFileUploading, setDocFileUploading] = useState(false);
  const [docUploadPct, setDocUploadPct] = useState(0);
  const docFileRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = () => {
    onProfileSave(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleProjectSubmit = () => {
    if (!editingProject?.title) return;
    onProjectSave({ ...editingProject, id: editingProject.id || generateId() });
    setEditingProject(null);
    setImageMode("url");
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;
    setImageUploading(true);
    setImageUploadPct(0);
    try {
      const path = `projects/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path, (pct) => setImageUploadPct(pct));
      setEditingProject({ ...editingProject, image: url });
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setImageUploading(false);
      setImageUploadPct(0);
    }
  };

  const handleDocFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocFileUploading(true);
    setDocUploadPct(0);
    try {
      const path = `documents/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path, (pct) => setDocUploadPct(pct));
      setDocForm((prev) => ({
        ...prev,
        fileUrl: url,
        title: prev.title || file.name.replace(/\.[^.]+$/, ""),
      }));
    } catch (err) {
      console.error("Document upload failed:", err);
    } finally {
      setDocFileUploading(false);
      setDocUploadPct(0);
    }
  };

  const handleDocumentAdd = () => {
    if (!docForm.title) return;
    onDocumentAdd({ ...docForm });
    setDocForm({ type: "certificate", title: "", description: "", fileUrl: "", date: "", issuer: "" });
  };

  const handleBlogSubmit = () => {
    if (!editingBlog?.title) return;
    onBlogSave({ ...editingBlog, id: editingBlog.id || generateId() });
    setEditingBlog(null);
  };

  const openNewProject = () => {
    setEditingProject({ id: "", title: "", description: "", tags: [], liveUrl: "", githubUrl: "", image: "" });
    setImageMode("url");
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "profile", label: "Profile", icon: <UserIcon className="size-4" /> },
    { key: "projects", label: "Projects", icon: <FolderIcon className="size-4" />, count: projects.length },
    { key: "documents", label: "Documents", icon: <FileTextIcon className="size-4" />, count: documents.length },
    { key: "blog", label: "Blog", icon: <BookOpenIcon className="size-4" />, count: blogPosts.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeftIcon className="size-4" />
                <span className="hidden sm:inline">Back to Portfolio</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <h1 className="text-slate-900" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                Admin Dashboard
              </h1>
            </div>
            <Badge className="bg-indigo-600 text-white border-0">Admin Mode</Badge>
          </div>

          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl">
            <h2 className="text-slate-900 mb-6" style={{ fontSize: "1.125rem", fontWeight: 600 }}>Edit Profile</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Title / Role</Label>
                  <Input value={profileForm.title} onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows={4} className="resize-none" />
              </div>
              <div className="space-y-1.5">
                <Label>Avatar URL</Label>
                <Input value={profileForm.avatar} onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })} placeholder="https://example.com/photo.jpg" />
                {profileForm.avatar && (
                  <img src={profileForm.avatar} alt="preview" className="w-16 h-16 rounded-xl object-cover mt-2 border border-slate-200" />
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} type="email" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} placeholder="City, Country" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label>GitHub URL</Label>
                  <Input value={profileForm.github} onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>LinkedIn URL</Label>
                  <Input value={profileForm.linkedin} onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Twitter URL</Label>
                  <Input value={profileForm.twitter} onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleProfileSave} className={`${profileSaved ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}>
                {profileSaved ? <CheckCircleIcon className="size-4" /> : <SaveIcon className="size-4" />}
                {profileSaved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Change Password (Firebase Auth) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl mt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <KeyRoundIcon className="size-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-slate-900" style={{ fontSize: "1rem", fontWeight: 600 }}>Change Admin Password</h2>
                <p className="text-xs text-slate-400">Updates your Firebase Authentication password</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => { setCurrentPw(e.target.value); setPwError(""); }}
                    placeholder="Enter your current password"
                    className={pwError && pwError.includes("Current") ? "border-red-400" : ""}
                  />
                  <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrentPw ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showNewPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => { setNewPw(e.target.value); setPwError(""); }}
                    placeholder="At least 6 characters"
                    className={pwError && !pwError.includes("Current") ? "border-red-400" : ""}
                  />
                  <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPw ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => { setConfirmPw(e.target.value); setPwError(""); }}
                  placeholder="Re-enter new password"
                  className={pwError && pwError.includes("match") ? "border-red-400" : ""}
                />
              </div>

              {pwError && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <InfoIcon className="size-3.5" /> {pwError}
                </p>
              )}

              {pwSuccess && (
                <p className="text-xs text-green-600 flex items-center gap-1.5">
                  <CheckCircleIcon className="size-3.5" /> Password updated successfully!
                </p>
              )}

              <Button
                onClick={handlePasswordChange}
                disabled={!currentPw || !newPw || !confirmPw || pwLoading}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {pwLoading ? <LoaderCircleIcon className="size-4 animate-spin" /> : <ShieldCheckIcon className="size-4" />}
                {pwLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
          </>
        )}

        {/* ── Projects Tab ── */}
        {activeTab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-slate-900" style={{ fontSize: "1.125rem", fontWeight: 600 }}>Manage Projects</h2>
                <p className="text-sm text-slate-400 mt-0.5">Add, edit or remove portfolio projects</p>
              </div>
              {!editingProject && (
                <Button onClick={openNewProject} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <PlusIcon className="size-4" />
                  Add New Project
                </Button>
              )}
            </div>

            {/* ── Add / Edit Form ── */}
            {editingProject && (
              <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg p-6 mb-8 mt-4">
                {/* Form header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm">
                      {editingProject.id ? <PencilIcon className="size-4" /> : <PlusIcon className="size-4" />}
                    </div>
                    <div>
                      <h3 className="text-slate-900" style={{ fontWeight: 600 }}>
                        {editingProject.id ? "Edit Project" : "Add New Project"}
                      </h3>
                      <p className="text-xs text-slate-400">Fill in the details below and save</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setEditingProject(null)} className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700">
                    <XIcon className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left column – text fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0">1</span>
                        Project Title <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. AI-Powered Task Manager"
                        className={!editingProject.title ? "border-orange-200 focus:border-indigo-400" : ""}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0">2</span>
                        Description
                      </Label>
                      <Textarea
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        rows={4}
                        className="resize-none"
                        placeholder="What does this project do? What problems does it solve?"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0">3</span>
                        Tech Stack / Tags
                      </Label>
                      <Input
                        value={editingProject.tags.join(", ")}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        placeholder="React, TypeScript, Node.js, MongoDB"
                      />
                      {editingProject.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {editingProject.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0">4</span>
                        Project Links
                      </Label>
                      <div className="space-y-2">
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                          <Input
                            value={editingProject.liveUrl}
                            onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                            placeholder="Live demo URL (https://myproject.com)"
                            className="pl-8"
                          />
                        </div>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                          <Input
                            value={editingProject.githubUrl}
                            onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                            placeholder="GitHub repo URL (https://github.com/you/repo)"
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column – image */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0">5</span>
                      Project Image
                    </Label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setImageMode("file")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-all ${
                          imageMode === "file"
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <UploadIcon className="size-4" />
                        Upload to Firebase
                      </button>
                      <button
                        onClick={() => setImageMode("url")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-all ${
                          imageMode === "url"
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <LinkIcon className="size-4" />
                        Paste image URL
                      </button>
                    </div>

                    {imageMode === "file" && (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileSelect}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={imageUploading}
                          className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center gap-2 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                            {imageUploading ? (
                              <LoaderCircleIcon className="size-5 text-indigo-400 animate-spin" />
                            ) : (
                              <ImageIcon className="size-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            )}
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-600 group-hover:text-indigo-600">
                              {imageUploading ? `Uploading... ${imageUploadPct}%` : "Click to choose image"}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Uploads to Firebase Storage · PNG, JPG, GIF</p>
                          </div>
                        </button>
                        {imageUploading && (
                          <div className="mt-2 bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${imageUploadPct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {imageMode === "url" && (
                      <div className="space-y-2">
                        <Input
                          value={editingProject.image}
                          onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                          placeholder="https://example.com/project-screenshot.png"
                        />
                        <p className="text-xs text-slate-400 flex items-start gap-1.5">
                          <InfoIcon className="size-3.5 flex-shrink-0 mt-0.5" />
                          Host images on Imgur, GitHub, or any CDN and paste the direct link here.
                        </p>
                      </div>
                    )}

                    {editingProject.image && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img
                          src={editingProject.image}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <button
                          onClick={() => setEditingProject({ ...editingProject, image: "" })}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                        >
                          <XIcon className="size-3.5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-3 py-2">
                          <p className="text-white text-xs">Preview</p>
                        </div>
                      </div>
                    )}

                    {!editingProject.image && (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 h-40 flex items-center justify-center">
                        <div className="text-center text-slate-300">
                          <ImageIcon className="size-10 mx-auto mb-1" />
                          <p className="text-xs">No image selected</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                  <Button
                    onClick={handleProjectSubmit}
                    disabled={!editingProject.title || imageUploading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                  >
                    <SaveIcon className="size-4" />
                    {editingProject.id ? "Update Project" : "Save & Publish"}
                  </Button>
                  <Button variant="outline" onClick={() => { setEditingProject(null); setImageMode("url"); }}>
                    Cancel
                  </Button>
                  {!editingProject.title && (
                    <p className="text-xs text-orange-500 flex items-center gap-1">
                      <InfoIcon className="size-3.5" /> Project title is required
                    </p>
                  )}
                </div>
              </div>
            )}

            {projects.length === 0 && !editingProject ? (
              <div
                onClick={openNewProject}
                className="cursor-pointer text-center py-16 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:text-indigo-400 transition-colors mt-4"
              >
                <FolderIcon className="size-12 mx-auto mb-3 opacity-30" />
                <p className="mb-1">No projects yet</p>
                <p className="text-sm text-indigo-500 hover:underline flex items-center justify-center gap-1">
                  <PlusIcon className="size-4" /> Click here to add your first project
                </p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {projects.map((project, idx) => (
                  <div key={project.id} className="group bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:border-indigo-200 hover:shadow-sm transition-all">
                    <span className="text-xs text-slate-300 w-5 text-center flex-shrink-0">{idx + 1}</span>
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-100" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="size-5 text-indigo-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 truncate" style={{ fontWeight: 500 }}>{project.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tags.slice(0, 4).map((t) => (
                          <span key={t} className="text-xs text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">{t}</span>
                        ))}
                        {project.tags.length > 4 && <span className="text-xs text-slate-400">+{project.tags.length - 4} more</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditingProject(project); setImageMode(project.image?.startsWith("http") ? "url" : "file"); }}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        title="Edit"
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onProjectDelete(project.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Documents Tab ── */}
        {activeTab === "documents" && (
          <div>
            <div className="mb-6">
              <h2 className="text-slate-900" style={{ fontSize: "1.125rem", fontWeight: 600 }}>Manage Documents</h2>
              <p className="text-sm text-slate-400 mt-0.5">Upload certificates, papers, resumes and internship reports to Firebase Storage</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
              <h3 className="text-slate-800 mb-4 flex items-center gap-2" style={{ fontWeight: 600 }}>
                <UploadIcon className="size-4 text-indigo-600" />
                Add New Document
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Document Title <span className="text-red-400">*</span></Label>
                    <Input
                      value={docForm.title}
                      onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                      placeholder="e.g. AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Document Type</Label>
                    <select
                      value={docForm.type}
                      onChange={(e) => setDocForm({ ...docForm, type: e.target.value as Document["type"] })}
                      className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400"
                    >
                      {docTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={docForm.description} onChange={(e) => setDocForm({ ...docForm, description: e.target.value })} rows={2} className="resize-none" />
                </div>

                <div className="space-y-2">
                  <Label>File / PDF</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <Input
                        value={docForm.fileUrl.startsWith("https://firebasestorage") ? "(uploaded to Firebase)" : docForm.fileUrl}
                        onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                        placeholder="https://drive.google.com/... or paste any PDF link"
                        className="pl-8"
                        readOnly={docForm.fileUrl.startsWith("https://firebasestorage")}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => docFileRef.current?.click()}
                      disabled={docFileUploading}
                      className="flex-shrink-0 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      {docFileUploading ? <LoaderCircleIcon className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
                      {docFileUploading ? `${docUploadPct}%` : "Upload File"}
                    </Button>
                    <input ref={docFileRef} type="file" accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={handleDocFileSelect} />
                  </div>
                  {docFileUploading && (
                    <div className="bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${docUploadPct}%` }}
                      />
                    </div>
                  )}
                  {docForm.fileUrl.startsWith("https://firebasestorage") && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircleIcon className="size-3.5" /> Uploaded to Firebase Storage
                    </p>
                  )}
                  <p className="text-xs text-slate-400 flex items-start gap-1">
                    <InfoIcon className="size-3.5 flex-shrink-0 mt-0.5" />
                    Upload directly to Firebase Storage, or paste a link from Google Drive, Dropbox, or any public URL.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Issuer / Publisher</Label>
                    <Input value={docForm.issuer} onChange={(e) => setDocForm({ ...docForm, issuer: e.target.value })} placeholder="e.g. Amazon Web Services" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date (YYYY-MM)</Label>
                    <Input value={docForm.date} onChange={(e) => setDocForm({ ...docForm, date: e.target.value })} placeholder="2024-06" />
                  </div>
                </div>

                <Button onClick={handleDocumentAdd} disabled={!docForm.title || docFileUploading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <PlusIcon className="size-4" />
                  Add Document
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => {
                const icons: Record<Document["type"], React.ReactNode> = {
                  certificate: <AwardIcon className="size-4 text-amber-500" />,
                  research: <BookOpenIcon className="size-4 text-blue-500" />,
                  resume: <FileIcon className="size-4 text-emerald-500" />,
                  internship: <BriefcaseIcon className="size-4 text-purple-500" />,
                };
                return (
                  <div key={doc.id} className="group bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">{icons[doc.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 truncate" style={{ fontWeight: 500 }}>{doc.title}</p>
                      <p className="text-xs text-slate-400">{doc.type} · {doc.issuer || "No issuer"} · {doc.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDocumentDelete(doc.id)} className="h-8 w-8 p-0 flex-shrink-0 text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                );
              })}
              {documents.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  <FileTextIcon className="size-10 mx-auto mb-2 opacity-30" />
                  <p>No documents yet. Use the form above to add your first document.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Blog Tab ── */}
        {activeTab === "blog" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-slate-900" style={{ fontSize: "1.125rem", fontWeight: 600 }}>Manage Blog Posts</h2>
                <p className="text-sm text-slate-400 mt-0.5">Write and publish articles to your portfolio</p>
              </div>
              <Button
                onClick={() => setEditingBlog({ id: "", title: "", excerpt: "", content: "", date: new Date().toISOString().split("T")[0], tags: [] })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <PlusIcon className="size-4" />
                New Post
              </Button>
            </div>

            {editingBlog && (
              <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 style={{ fontWeight: 600 }}>{editingBlog.id ? "Edit Post" : "Write New Post"}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingBlog(null)} className="h-8 w-8 p-0"><XIcon className="size-4" /></Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Post Title <span className="text-red-400">*</span></Label>
                      <Input value={editingBlog.title} onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })} placeholder="My Blog Post Title" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Tags (comma separated)</Label>
                      <Input value={editingBlog.tags.join(", ")} onChange={(e) => setEditingBlog({ ...editingBlog, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="React, TypeScript" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Excerpt / Summary</Label>
                    <Textarea value={editingBlog.excerpt} onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })} rows={2} className="resize-none" placeholder="A brief summary shown on the blog card..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Full Content</Label>
                    <Textarea value={editingBlog.content} onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })} rows={8} className="resize-none" placeholder="Write your full article here..." />
                  </div>
                  <div className="space-y-1.5 max-w-xs">
                    <Label>Publish Date</Label>
                    <Input type="date" value={editingBlog.date} onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })} />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleBlogSubmit} disabled={!editingBlog.title} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <SaveIcon className="size-4" />
                      {editingBlog.id ? "Update Post" : "Publish Post"}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingBlog(null)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {blogPosts.map((post) => (
                <div key={post.id} className="group bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4 hover:border-indigo-200 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 truncate" style={{ fontWeight: 500 }}>{post.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{post.date} · {post.tags.join(", ")}</p>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{post.excerpt}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => setEditingBlog(post)} className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"><PencilIcon className="size-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onBlogDelete(post.id)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2Icon className="size-3.5" /></Button>
                  </div>
                </div>
              ))}
              {blogPosts.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  <BookOpenIcon className="size-10 mx-auto mb-2 opacity-30" />
                  <p>No blog posts yet. Click "New Post" to write your first article.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
