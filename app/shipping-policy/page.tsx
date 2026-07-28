import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, ShieldCheck, Clock } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="outline">Logistics & Express Shipping</Badge>
        <h1 className="text-4xl font-bold font-serif">Shipping & Delivery Policy</h1>
        <p className="text-sm text-muted-foreground">
          How we handle cold-chain fruit transport and bare-root sapling delivery across India.
        </p>
      </div>

      <Card className="glass-card rounded-3xl p-8 border space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">1. Express Transit & Free Shipping Threshold</h3>
          <p>
            Orders over ₹1,999 qualify for <strong>FREE Express Shipping</strong> anywhere in India. For orders under ₹1,999, a flat shipping fee of ₹150 applies.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">2. Temperature-Controlled Packaging</h3>
          <p>
            Fresh apples are shipped in ventilated, food-grade molded pulp containers designed to absorb road vibrations. Saplings are packed in moisture-retaining coir root bags to prevent dehydration during 3-5 day transit.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">3. Order Dispatch Timelines</h3>
          <p>
            Produce orders are dispatched within 24 hours of harvest. Nursery plant pre-orders are shipped according to the regional seasonal planting window (December through March).
          </p>
        </div>
      </Card>
    </div>
  );
}
