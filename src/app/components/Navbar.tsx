import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MenuIcon, XIcon, LogOutIcon, LayoutDashboardIcon } from "lucide-react";

interface NavbarProps {
  isAdmin: boolean;
  onAdminLogout: () => void;
  onAdminPanelClick: () => void;
  showAdminPanel: boolean;
}

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Documents", href: "#documents" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ isAdmin, onAdminLogout, onAdminPanelClick, showAdminPanel }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    if (showAdminPanel) {
      onAdminPanelClick();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo("#about")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm">P</span>
            </div>
            <span className="text-slate-800 hidden sm:block">Portfolio</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="px-3 py-2 rounded-md text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onAdminPanelClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${showAdminPanel ? "bg-indigo-600 text-white" : "text-indigo-600 hover:bg-indigo-50"}`}
              >
                <LayoutDashboardIcon className="size-3.5" />
                Admin Panel
              </button>
              <Button variant="outline" size="sm" onClick={onAdminLogout}>
                <LogOutIcon className="size-3.5" />
                Logout
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-2 border-t border-slate-100">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="block w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <div className="px-4 pt-2 pb-2 flex flex-col gap-2">
                <Button variant="default" size="sm" onClick={() => { onAdminPanelClick(); setMenuOpen(false); }} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <LayoutDashboardIcon className="size-3.5" /> Admin Panel
                </Button>
                <Button variant="outline" size="sm" onClick={onAdminLogout} className="w-full">
                  <LogOutIcon className="size-3.5" /> Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
