"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent to our Orchard Advisory Team.");
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="outline">Get In Touch</Badge>
        <h1 className="text-4xl font-bold font-serif">Contact Orchard Advisory</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Have questions about sapling pre-orders, elevation suitability, or bulk commercial rates? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info cards */}
        <div className="space-y-4">
          <Card className="glass-card p-5 rounded-2xl border space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Nursery Location</h4>
                <p className="text-xs text-muted-foreground">Kullu Valley, HP - 175101</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-5 rounded-2xl border space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Phone Support</h4>
                <p className="text-xs text-muted-foreground">+91 (800) 555-ORCHARD</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-5 rounded-2xl border space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Email Inquiry</h4>
                <p className="text-xs text-muted-foreground">support@orchard-store.com</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact form */}
        <Card className="glass-card rounded-3xl p-6 lg:p-8 border lg:col-span-2 space-y-6">
          <h3 className="font-bold text-xl font-serif">Send Us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Your Name</label>
                <Input
                  required
                  placeholder="Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Your Email</label>
                <Input
                  type="email"
                  required
                  placeholder="aarav@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Inquiry Details</label>
              <textarea
                required
                rows={4}
                placeholder="Ask about M9 rootstock availability, pre-order dates, or farm visit schedule..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border bg-background/60 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <Button type="submit" size="lg" className="rounded-2xl gap-2 font-bold" isLoading={loading}>
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
