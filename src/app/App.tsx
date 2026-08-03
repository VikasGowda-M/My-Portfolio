import { useState, useEffect } from "react";
import {
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  KeyboardIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Documents } from "./components/Documents";
import { Blog } from "./components/Blog";
import { Contact } from "./components/Contact";
import { AdminPanel } from "./components/AdminPanel";
import type { Profile, Project, Document, BlogPost } from "./data";
import { defaultProfile, defaultProjects, defaultDocuments, defaultBlogPosts } from "./data";

// Firebase
import { isFirebaseConfigured } from "../firebase/firebase";
import { loginAdmin, logoutAdmin, onAuthChange } from "../firebase/auth";
import {
  subscribeToProfile,
  subscribeToProjects,
  subscribeToDocuments,
  subscribeToBlogPosts,
  saveProfile,
  upsertProject,
  deleteProject,
  addDocument,
  deleteDocument,
  upsertBlogPost,
  deleteBlogPost,
  seedDefaultData,
} from "../firebase/firestore";

function FirebaseSetupScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
          <ShieldCheckIcon className="size-7 text-orange-500" />
        </div>
        <h1 className="text-slate-900 mb-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
          Firebase Setup Required
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Your portfolio uses Firebase for data storage and authentication. Follow these steps to connect it.
        </p>

        <div className="space-y-4 text-sm">
          {[
            {
              step: 1,
              title: "Create a Firebase project",
              body: "Go to console.firebase.google.com → Add project → give it any name.",
            },
            {
              step: 2,
              title: "Enable Email/Password Auth",
              body: "In your project: Authentication → Sign-in method → Email/Password → Enable. Then create your admin user under Authentication → Users.",
            },
            {
              step: 3,
              title: "Enable Firestore + Storage",
              body: 'Firestore Database → Create database (start in test mode). Storage → Get started (test mode). Apply the security rules from .env.example.',
            },
            {
              step: 4,
              title: "Create a .env file",
              body: 'Copy .env.example to .env in the project root and fill in your Firebase config values from Project Settings → Your apps → Web app.',
            },
            {
              step: 5,
              title: "Restart the dev server",
              body: "After saving .env, restart the Vite dev server so the new environment variables are picked up.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <p className="text-slate-800" style={{ fontWeight: 600 }}>{title}</p>
                <p className="text-slate-500 mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 mb-2" style={{ fontWeight: 600 }}>Required .env variables:</p>
          <pre className="text-xs text-slate-600 leading-relaxed">{`VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=`}</pre>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  if (!isFirebaseConfigured) return <FirebaseSetupScreen />;

  // ── Data state (populated by Firestore onSnapshot) ──────────────────────
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [documents, setDocuments] = useState<Document[]>(defaultDocuments);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultBlogPosts);

  // ── Auth + UI state ───────────────────────────────────────────────────────
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Loading state (true until auth + first data snapshot arrive) ─────────
  const [authReady, setAuthReady] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // ── Firebase Auth listener ────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setIsAdmin(!!user);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // ── Firestore real-time subscriptions ────────────────────────────────────
  useEffect(() => {
    let profileReady = false, projectsReady = false, docsReady = false, blogsReady = false;

    const checkAllReady = () => {
      if (profileReady && projectsReady && docsReady && blogsReady) {
        setDataLoading(false);
      }
    };

    const unsubProfile = subscribeToProfile(
      (p) => { setProfile(p); profileReady = true; checkAllReady(); },
      (err) => { console.error("Profile:", err); profileReady = true; checkAllReady(); }
    );
    const unsubProjects = subscribeToProjects(
      (p) => { setProjects(p); projectsReady = true; checkAllReady(); },
      (err) => { console.error("Projects:", err); projectsReady = true; checkAllReady(); }
    );
    const unsubDocs = subscribeToDocuments(
      (d) => { setDocuments(d); docsReady = true; checkAllReady(); },
      (err) => { console.error("Documents:", err); docsReady = true; checkAllReady(); }
    );
    const unsubBlogs = subscribeToBlogPosts(
      (b) => { setBlogPosts(b); blogsReady = true; checkAllReady(); },
      (err) => { console.error("Blogs:", err); blogsReady = true; checkAllReady(); }
    );

    // Seed Firestore with default data if it's empty (first-run only)
    seedDefaultData().catch(console.error);

    return () => { unsubProfile(); unsubProjects(); unsubDocs(); unsubBlogs(); };
  }, []);

  // ── Secret keyboard shortcut: Ctrl + Shift + A ───────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        if (!isAdmin) setLoginOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError("Please enter your email and password.");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      await loginAdmin(email, password);
      setLoginOpen(false);
      setEmail("");
      setPassword("");
    } catch {
      setLoginError("Incorrect email or password. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  // ── Profile ───────────────────────────────────────────────────────────────
  const handleProfileSave = async (updated: Profile) => {
    try {
      await saveProfile(updated);
    } catch (err) {
      console.error("Save profile failed:", err);
    }
  };

  // ── Projects ──────────────────────────────────────────────────────────────
  const handleProjectSave = async (project: Project) => {
    try {
      await upsertProject(project);
    } catch (err) {
      console.error("Save project failed:", err);
    }
  };

  const handleProjectDelete = async (id: string) => {
    try {
      await deleteProject(id);
    } catch (err) {
      console.error("Delete project failed:", err);
    }
  };

  // ── Documents ─────────────────────────────────────────────────────────────
  const handleDocumentAdd = async (doc: Omit<Document, "id">) => {
    try {
      await addDocument(doc);
    } catch (err) {
      console.error("Add document failed:", err);
    }
  };

  const handleDocumentDelete = async (id: string) => {
    try {
      await deleteDocument(id);
    } catch (err) {
      console.error("Delete document failed:", err);
    }
  };

  // ── Blog ──────────────────────────────────────────────────────────────────
  const handleBlogSave = async (post: BlogPost) => {
    try {
      await upsertBlogPost(post);
    } catch (err) {
      console.error("Save blog failed:", err);
    }
  };

  const handleBlogDelete = async (id: string) => {
    try {
      await deleteBlogPost(id);
    } catch (err) {
      console.error("Delete blog failed:", err);
    }
  };

  // ── Global loading screen ─────────────────────────────────────────────────
  if (!authReady || dataLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoaderCircleIcon className="size-10 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        isAdmin={isAdmin}
        onAdminLogout={handleLogout}
        onAdminPanelClick={() => setShowAdminPanel((v) => !v)}
        showAdminPanel={showAdminPanel}
      />

      {showAdminPanel && isAdmin ? (
        <AdminPanel
          profile={profile}
          projects={projects}
          documents={documents}
          blogPosts={blogPosts}
          onProfileSave={handleProfileSave}
          onProjectSave={handleProjectSave}
          onProjectDelete={handleProjectDelete}
          onDocumentAdd={handleDocumentAdd}
          onDocumentDelete={handleDocumentDelete}
          onBlogSave={handleBlogSave}
          onBlogDelete={handleBlogDelete}
          onBack={() => setShowAdminPanel(false)}
        />
      ) : (
        <>
          <Hero profile={profile} documents={documents} />
          <Projects
            projects={projects}
            isAdmin={isAdmin}
            onEdit={() => setShowAdminPanel(true)}
            onDelete={handleProjectDelete}
          />
          <Documents documents={documents} isAdmin={isAdmin} onDelete={handleDocumentDelete} />
          <Blog
            posts={blogPosts}
            isAdmin={isAdmin}
            onEdit={() => setShowAdminPanel(true)}
            onDelete={handleBlogDelete}
          />
          <Contact profile={profile} />

          <footer className="bg-slate-900 text-slate-400 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs">P</span>
                  </div>
                  <span className="text-slate-300">{profile.name}</span>
                </div>
                <p className="text-sm">
                  © {new Date().getFullYear()} {profile.name}. All rights reserved.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Built with</span>
                  <span className="text-xs text-indigo-400">React + Firebase</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ── Admin Login Dialog (Ctrl+Shift+A) ─────────────────────────────── */}
      <Dialog
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (!open) {
            setEmail("");
            setPassword("");
            setLoginError("");
            setShowPassword(false);
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <ShieldCheckIcon className="size-6 text-indigo-600" />
            </div>
            <DialogTitle className="text-center">Admin Access</DialogTitle>
            <DialogDescription className="text-center">
              Sign in with your Firebase admin account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="admin@example.com"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter password"
                  className={loginError ? "border-red-400" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
              {loginError && <p className="text-xs text-red-500">{loginError}</p>}
            </div>

            <Button
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loginLoading ? (
                <LoaderCircleIcon className="size-4 animate-spin" />
              ) : (
                <ShieldCheckIcon className="size-4" />
              )}
              {loginLoading ? "Signing in..." : "Login"}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <KeyboardIcon className="size-3.5" />
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">
                Ctrl+Shift+A
              </kbd>{" "}
              to open this anytime
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
