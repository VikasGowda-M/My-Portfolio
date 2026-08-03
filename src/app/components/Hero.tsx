import { GithubIcon, LinkedinIcon, TwitterIcon, MailIcon, MapPinIcon, PhoneIcon, DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Profile, Document } from "../data";

interface HeroProps {
  profile: Profile;
  documents: Document[];
}

function downloadFile(url: string, title: string) {
  if (!url || url === "#") return;
  let href = url;
  if (url.startsWith("data:")) {
    const [header, base64] = url.split(",");
    const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    href = URL.createObjectURL(new Blob([bytes], { type: mime }));
  }
  const a = document.createElement("a");
  a.href = href;
  a.download = title || "resume";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function Hero({ profile, documents }: HeroProps) {
  // Prefer the resume with a real file URL; fall back to any resume
  const resumes = documents.filter((d) => d.type === "resume");
  const resume = resumes.find((d) => d.fileUrl && d.fileUrl !== "#") ?? resumes[0];
  const hasValidResume = !!resume && !!resume.fileUrl && resume.fileUrl !== "#";

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <section id="about" className="min-h-screen flex items-center relative overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40 -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-5xl md:text-6xl">{initials}</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-green-400 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm mb-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              Available for opportunities
            </div>

            <h1 className="text-slate-900 mb-2" style={{ fontSize: "2.75rem", fontWeight: 700, lineHeight: 1.15 }}>
              Hi, I'm <span className="text-indigo-600">{profile.name}</span>
            </h1>

            <h2 className="text-slate-500 mb-6" style={{ fontSize: "1.25rem", fontWeight: 400 }}>
              {profile.title}
            </h2>

            <p className="text-slate-600 max-w-xl mb-8 leading-relaxed" style={{ fontSize: "1rem" }}>
              {profile.bio}
            </p>

            {/* Contact info pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8 text-sm text-slate-500">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-4 text-indigo-400" />
                  {profile.location}
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1.5">
                  <MailIcon className="size-4 text-indigo-400" />
                  {profile.email}
                </span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <PhoneIcon className="size-4 text-indigo-400" />
                  {profile.phone}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                onClick={() => {
                  const el = document.querySelector("#contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get in Touch
              </Button>
              {resume && (
                <Button
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!hasValidResume}
                  onClick={() => hasValidResume && downloadFile(resume.fileUrl, resume.title)}
                  title={!hasValidResume ? "No resume uploaded yet" : "Download Resume"}
                >
                  <DownloadIcon className="size-4" />
                  Download Resume
                </Button>
              )}
            </div>

            {/* Social links */}
            <div className="flex justify-center md:justify-start gap-4">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <GithubIcon className="size-5" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <LinkedinIcon className="size-5" />
                </a>
              )}
              {profile.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <TwitterIcon className="size-5" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <MailIcon className="size-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => {
              const el = document.querySelector("#projects");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors"
          >
            <span className="text-xs tracking-widest uppercase">Scroll Down</span>
            <div className="w-5 h-8 border-2 border-current rounded-full flex justify-center pt-1">
              <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
