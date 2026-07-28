import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2 } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="outline">Growth Guarantee</Badge>
        <h1 className="text-4xl font-bold font-serif">Returns & Refund Policy</h1>
        <p className="text-sm text-muted-foreground">
          Our 100% plant growth backing and replacement promise for commercial growers.
        </p>
      </div>

      <Card className="glass-card rounded-3xl p-8 border space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">1. 100% Nursery Growth Guarantee</h3>
          <p>
            If any feathered sapling or clonal rootstock liner fails to break dormancy within 45 days of planting under proper soil conditions, Orchard provides free plant replacement or store credit.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">2. Fresh Produce Quality Protection</h3>
          <p>
            In the rare event of transit damage to fresh fruit boxes, submit photo proof to `support@orchard-store.com` within 48 hours for an instant refund or reshipment.
          </p>
        </div>
      </Card>
    </div>
  );
}
