import { useState } from "react";
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Profile } from "../data";

interface ContactProps {
  profile: Profile;
}

export function Contact({ profile }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 text-sm tracking-widest uppercase mb-3 block">Get in Touch</span>
          <h2 className="text-slate-900 mb-4" style={{ fontSize: "2.25rem", fontWeight: 700 }}>
            Contact Me
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-slate-900 mb-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                Let's talk
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                I'm open to freelance opportunities, research collaborations, and full-time positions. Don't hesitate to reach out!
              </p>
            </div>

            <div className="space-y-4">
              {profile.email && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <MailIcon className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Email</p>
                    <a href={`mailto:${profile.email}`} className="text-slate-700 hover:text-indigo-600 transition-colors text-sm">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                    <a href={`tel:${profile.phone}`} className="text-slate-700 hover:text-indigo-600 transition-colors text-sm">
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}
              {profile.location && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Location</p>
                    <p className="text-slate-700 text-sm">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 bg-indigo-600 rounded-2xl text-white">
              <p className="text-sm mb-1 text-indigo-200">Response time</p>
              <p className="font-medium">Usually within 24 hours</p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="size-8 text-green-600" />
                  </div>
                  <h3 className="text-slate-900 mb-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell me about your project or idea..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <SendIcon className="size-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
