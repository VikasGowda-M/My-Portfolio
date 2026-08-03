import { useState, useEffect } from "react";
import { ShieldCheckIcon, EyeIcon, EyeOffIcon, KeyboardIcon } from "lucide-react";
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
import {
  Profile,
  Project,
  Document,
  BlogPost,
  loadProfile,
  loadProjects,
  loadDocuments,
  loadBlogPosts,
  saveToStorage,
} from "./data";

const DEFAULT_PASSWORD = "admin@123";

function loadAdminPassword(): string {
  return localStorage.getItem("portfolio_admin_password") || DEFAULT_PASSWORD;
}

export default function App() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [documents, setDocuments] = useState<Document[]>(loadDocuments);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(loadBlogPosts);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Secret keyboard shortcut: Ctrl + Shift + A
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

  const handleLogin = () => {
    const adminPassword = loadAdminPassword();
    if (password === adminPassword) {
      setIsAdmin(true);
      setLoginOpen(false);
      setPassword("");
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
    setPassword("");
  };

  const handlePasswordChange = (newPassword: string) => {
    localStorage.setItem("portfolio_admin_password", newPassword);
  };

  // Profile
  const handleProfileSave = (updated: Profile) => {
    setProfile(updated);
    saveToStorage("portfolio_profile", updated);
  };

  // Projects
  const handleProjectSave = (project: Project) => {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === project.id);
      const updated = exists ? prev.map((p) => (p.id === project.id ? project : p)) : [...prev, project];
      saveToStorage("portfolio_projects", updated);
      return updated;
    });
  };

  const handleProjectDelete = (id: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveToStorage("portfolio_projects", updated);
      return updated;
    });
  };

  // Documents
  const handleDocumentAdd = (doc: Document) => {
    setDocuments((prev) => {
      const updated = [...prev, doc];
      saveToStorage("portfolio_documents", updated);
      return updated;
    });
  };

  const handleDocumentDelete = (id: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      saveToStorage("portfolio_documents", updated);
      return updated;
    });
  };

  // Blog
  const handleBlogSave = (post: BlogPost) => {
    setBlogPosts((prev) => {
      const exists = prev.find((p) => p.id === post.id);
      const updated = exists ? prev.map((p) => (p.id === post.id ? post : p)) : [...prev, post];
      saveToStorage("portfolio_blogs", updated);
      return updated;
    });
  };

  const handleBlogDelete = (id: string) => {
    setBlogPosts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveToStorage("portfolio_blogs", updated);
      return updated;
    });
  };

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
          onPasswordChange={handlePasswordChange}
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
          <Blog posts={blogPosts} isAdmin={isAdmin} onEdit={() => setShowAdminPanel(true)} onDelete={handleBlogDelete} />
          <Contact profile={profile} />

          {/* Footer */}
          <footer className="bg-slate-900 text-slate-400 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs">P</span>
                  </div>
                  <span className="text-slate-300">{profile.name}</span>
                </div>
                <p className="text-sm">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Built with</span>
                  <span className="text-xs text-indigo-400">React + Tailwind</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Admin Login Dialog — triggered only via Ctrl+Shift+A */}
      <Dialog
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (!open) { setPassword(""); setLoginError(""); setShowPassword(false); }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <ShieldCheckIcon className="size-6 text-indigo-600" />
            </div>
            <DialogTitle className="text-center">Admin Access</DialogTitle>
            <DialogDescription className="text-center">
              Enter your admin password to manage portfolio content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter admin password"
                  className={loginError ? "border-red-400 focus:border-red-400" : ""}
                  autoFocus
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

            <Button onClick={handleLogin} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <ShieldCheckIcon className="size-4" />
              Login
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <KeyboardIcon className="size-3.5" />
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">Ctrl+Shift+A</kbd> to open this anytime
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
