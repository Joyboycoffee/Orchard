"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutAction();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="rounded-2xl gap-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
      onClick={handleLogout}
      isLoading={loading}
    >
      <LogOut className="h-4 w-4" /> Sign Out
    </Button>
  );
}
