"use client";

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
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products & Stock", href: "/admin/products", icon: Package },
    { label: "Customer CRM", href: "/admin/customers", icon: Users },
    { label: "Coupons & Offers", href: "/admin/coupons", icon: Tag },
    { label: "Blog & Guides CMS", href: "/admin/blogs", icon: FileText },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r glass-navbar shrink-0 hidden md:block min-h-screen p-4 space-y-6">
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
          <TreePine className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground font-serif">Orchard Admin</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Management Suite</span>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
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
      </nav>

      <div className="pt-6 border-t px-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
        </Link>
      </div>
    </aside>
  );
}
