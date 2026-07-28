import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, ShieldCheck, Truck } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-serif">Store Configuration & Logistics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage currency settings, free shipping thresholds, and nursery dispatch windows.
        </p>
      </div>

      <Card className="glass-card rounded-3xl p-6 lg:p-8 border space-y-6">
        <h3 className="font-bold text-lg font-serif">General Settings</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Store Name</label>
            <Input defaultValue="Orchard E-Commerce Platform" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Support Email</label>
            <Input defaultValue="support@orchard-store.com" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Free Shipping Threshold (INR)</label>
            <Input defaultValue="1999" className="rounded-xl font-mono" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Standard Courier Fee (INR)</label>
            <Input defaultValue="150" className="rounded-xl font-mono" />
          </div>
        </div>

        <Button size="lg" className="rounded-2xl font-bold">
          Save System Settings
        </Button>
      </Card>
    </div>
  );
}
