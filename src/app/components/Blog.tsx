import { CalendarIcon, TagIcon, ArrowRightIcon, Trash2Icon, PencilIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BlogPost } from "../data";

interface BlogProps {
  posts: BlogPost[];
  isAdmin: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

export function Blog({ posts, isAdmin, onEdit, onDelete }: BlogProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 text-sm tracking-widest uppercase mb-3 block">Writing</span>
          <h2 className="text-slate-900 mb-4" style={{ fontSize: "2.25rem", fontWeight: 700 }}>
            Blog & Articles
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Thoughts on technology, research, and software development.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No blog posts yet. {isAdmin ? "Add your first post from the Admin Panel." : ""}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col"
              >
                {/* Gradient top bar */}
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarIcon className="size-3.5" />
                      {formatDate(post.date)}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-600"
                          onClick={() => onEdit(post)}
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(post.id)}
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <h3
                    className="text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors"
                    style={{ fontSize: "1.0625rem", fontWeight: 600, lineHeight: 1.4 }}
                  >
                    {post.title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-5 flex-1 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 border-0 text-xs"
                        >
                          <TagIcon className="size-2.5 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <button className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors group/btn">
                    Read More
                    <ArrowRightIcon className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
