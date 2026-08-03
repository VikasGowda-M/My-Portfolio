import { ExternalLinkIcon, GithubIcon, Trash2Icon, PencilIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Project } from "../data";

interface ProjectsProps {
  projects: Project[];
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function Projects({ projects, isAdmin, onEdit, onDelete }: ProjectsProps) {
  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 text-sm tracking-widest uppercase mb-3 block">Portfolio</span>
          <h2 className="text-slate-900 mb-4" style={{ fontSize: "2.25rem", fontWeight: 700 }}>
            Featured Projects
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            A selection of projects I've built — ranging from full-stack web apps to research prototypes.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No projects yet. {isAdmin ? "Add your first project from the Admin Panel." : ""}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-indigo-300 text-6xl">⬡</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Admin actions overlay */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 backdrop-blur-sm h-8 px-2"
                        onClick={() => onEdit(project)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-2"
                        onClick={() => onDelete(project.id)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-slate-900 mb-2" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    {project.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-0 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                      >
                        <ExternalLinkIcon className="size-3.5" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== "#" && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
                      >
                        <GithubIcon className="size-3.5" />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
