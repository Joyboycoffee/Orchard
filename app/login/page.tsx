"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { loginAction } from "@/actions/auth";
import { toast } from "sonner";
import { TreePine, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAction({ email, password });
      if (res.success) {
        toast.success(res.message);
        router.push(callbackUrl);
        router.refresh();
      } else {
        toast.error(res.error || "Login failed");
      }
    } catch {
      toast.error("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <Card className="glass-card p-8 rounded-3xl border space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <TreePine className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-serif">Welcome Back</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your Orchard account, order history & saved sapling lists.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
            </label>
            <Input
              type="email"
              required
              placeholder="customer@orchard.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" /> Password
            </label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <Button type="submit" size="lg" className="w-full rounded-2xl font-bold" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Create Account
          </Link>
        </div>
      </Card>
    </div>
  );
}
