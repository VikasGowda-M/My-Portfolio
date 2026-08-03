import { useState } from "react";
import {
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  Trash2Icon,
  AwardIcon,
  BookOpenIcon,
  FileIcon,
  BriefcaseIcon,
  ImageIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Document } from "../data";

type FileKind = "pdf" | "image" | "other";

function getFileKind(url: string): FileKind {
  if (!url || url === "#") return "other";
  const lower = url.toLowerCase();
  if (lower.startsWith("data:application/pdf") || lower.includes(".pdf")) return "pdf";
  if (
    lower.startsWith("data:image/") ||
    /\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/.test(lower)
  ) return "image";
  return "other";
}

// Converts a data URL to a Blob URL so browsers don't block it
function dataUrlToBlobUrl(dataUrl: string): string {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });
  return URL.createObjectURL(blob);
}

function resolveUrl(url: string): string {
  if (url.startsWith("data:")) return dataUrlToBlobUrl(url);
  return url;
}

function handleView(url: string) {
  if (!url || url === "#") return;
  const resolved = resolveUrl(url);
  window.open(resolved, "_blank", "noopener,noreferrer");
}

function handleDownload(url: string, title: string) {
  if (!url || url === "#") return;
  const resolved = resolveUrl(url);
  const a = document.createElement("a");
  a.href = resolved;
  a.download = title || "download";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function getViewLabel(url: string): string {
  const kind = getFileKind(url);
  if (kind === "pdf") return "Open PDF";
  if (kind === "image") return "View Image";
  return "View";
}

function getDownloadLabel(url: string): string {
  const kind = getFileKind(url);
  if (kind === "image") return "Open";
  return "Download";
}

interface DocumentsProps {
  documents: Document[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

type TabType = "all" | "certificate" | "research" | "resume" | "internship";

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <FileTextIcon className="size-4" /> },
  { key: "certificate", label: "Certificates", icon: <AwardIcon className="size-4" /> },
  { key: "research", label: "Research Papers", icon: <BookOpenIcon className="size-4" /> },
  { key: "resume", label: "Resumes", icon: <FileIcon className="size-4" /> },
  { key: "internship", label: "Internship Reports", icon: <BriefcaseIcon className="size-4" /> },
];

const typeColors: Record<Document["type"], { bg: string; text: string; label: string }> = {
  certificate: { bg: "bg-amber-50", text: "text-amber-700", label: "Certificate" },
  research: { bg: "bg-blue-50", text: "text-blue-700", label: "Research" },
  resume: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Resume" },
  internship: { bg: "bg-purple-50", text: "text-purple-700", label: "Internship" },
};

const typeIcons: Record<Document["type"], React.ReactNode> = {
  certificate: <AwardIcon className="size-5" />,
  research: <BookOpenIcon className="size-5" />,
  resume: <FileIcon className="size-5" />,
  internship: <BriefcaseIcon className="size-5" />,
};

export function Documents({ documents, isAdmin, onDelete }: DocumentsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filtered = activeTab === "all" ? documents : documents.filter((d) => d.type === activeTab);

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <section id="documents" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-indigo-600 text-sm tracking-widest uppercase mb-3 block">Files</span>
          <h2 className="text-slate-900 mb-4" style={{ fontSize: "2.25rem", fontWeight: 700 }}>
            Documents & Credentials
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Certificates, research papers, resumes, and internship reports — all in one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const count = tab.key === "all" ? documents.length : documents.filter((d) => d.type === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                  activeTab === tab.key
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileTextIcon className="size-12 mx-auto mb-3 opacity-30" />
            <p>No documents in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc) => {
              const colors = typeColors[doc.type];
              return (
                <div
                  key={doc.id}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0`}>
                      {typeIcons[doc.type]}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`${colors.bg} ${colors.text} border-0 text-xs`}
                      >
                        {colors.label}
                      </Badge>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(doc.id)}
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-slate-900 mb-2" style={{ fontSize: "0.9375rem", fontWeight: 600, lineHeight: 1.4 }}>
                    {doc.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
                    {doc.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    {doc.issuer && <span className="truncate">{doc.issuer}</span>}
                    <span className="ml-auto flex-shrink-0">{formatDate(doc.date)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300"
                      onClick={() => handleView(doc.fileUrl)}
                      disabled={!doc.fileUrl || doc.fileUrl === "#"}
                    >
                      {getFileKind(doc.fileUrl) === "image"
                        ? <ImageIcon className="size-3.5" />
                        : <EyeIcon className="size-3.5" />}
                      {getViewLabel(doc.fileUrl)}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => handleDownload(doc.fileUrl, doc.title)}
                      disabled={!doc.fileUrl || doc.fileUrl === "#"}
                    >
                      <DownloadIcon className="size-3.5" />
                      {getDownloadLabel(doc.fileUrl)}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
