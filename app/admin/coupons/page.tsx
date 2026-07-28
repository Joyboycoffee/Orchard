import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";

export default function AdminCouponsPage() {
  const coupons = [
    { id: "1", code: "WELCOME10", discount: "10%", minOrder: "₹999", usage: 48, status: "ACTIVE" },
    { id: "2", code: "ORCHARD200", discount: "₹200", minOrder: "₹1,999", usage: 112, status: "ACTIVE" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Coupons & Promo Offers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create promotional discount codes for nursery pre-orders and produce crates.
          </p>
        </div>
        <Button size="sm" className="rounded-xl font-bold gap-2">
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <Card className="glass-card rounded-3xl p-6 border">
        <table className="w-full text-xs text-left">
          <thead className="border-b bg-muted/40 text-muted-foreground">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">Times Used</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-muted/20">
                <td className="p-3 font-mono font-bold text-foreground">{c.code}</td>
                <td className="p-3 font-bold text-primary">{c.discount}</td>
                <td className="p-3">{c.minOrder}</td>
                <td className="p-3">{c.usage} times</td>
                <td className="p-3">
                  <Badge variant="success">{c.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
