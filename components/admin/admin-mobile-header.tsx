"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  FileText,
  ShieldAlert,
  Settings,
  TreePine,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products & Stock", href: "/admin/products", icon: Package },
    { label: "Customer CRM", href: "/admin/customers", icon: Users },
    { label: "Coupons & Offers", href: "/admin/coupons", icon: Tag },
    { label: "Blog & Guides CMS", href: "/admin/blogs", icon: FileText },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <header className="md:hidden sticky top-0 z-40 w-full glass-navbar border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
          <TreePine className="h-4 w-4" />
        </div>
        <span className="font-bold text-sm font-serif">Orchard Admin</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b shadow-2xl p-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t px-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
