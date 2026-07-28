import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tag, Sparkles, ArrowRight, Percent } from "lucide-react";

export default function OffersPage() {
  const coupons = [
    {
      code: "WELCOME10",
      discount: "10% OFF",
      description: "Valid on your first produce or nursery order above ₹999.",
      minOrder: "₹999",
      badge: "New Customer Special",
    },
    {
      code: "ORCHARD200",
      discount: "₹200 OFF",
      description: "Flat ₹200 instant discount on high-density sapling pre-orders.",
      minOrder: "₹1,999",
      badge: "Nursery Bundle",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="outline">Seasonal Promotions</Badge>
        <h1 className="text-4xl font-bold font-serif">Special Bundles & Discount Coupons</h1>
        <p className="text-sm text-muted-foreground">
          Apply these verified promo codes at checkout for extra savings on rootstocks, secateurs, and fresh apples.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((c) => (
          <Card key={c.code} className="glass-card rounded-3xl p-6 border space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="glass">{c.badge}</Badge>
                <span className="text-2xl font-extrabold text-primary">{c.discount}</span>
              </div>
              <h3 className="font-bold text-lg font-mono tracking-wider">{c.code}</h3>
              <p className="text-xs text-muted-foreground">{c.description}</p>
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Min Order: <strong>{c.minOrder}</strong></span>
              <Link href="/products">
                <Button size="sm" className="rounded-xl text-xs gap-1">
                  Shop Now <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
