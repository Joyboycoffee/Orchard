import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="outline">Legal Agreement</Badge>
        <h1 className="text-4xl font-bold font-serif">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Terms governing customer orders, nursery plant pre-orders, and website usage.
        </p>
      </div>

      <Card className="glass-card rounded-3xl p-8 border space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">1. Pre-Orders & Seasonal Delivery</h3>
          <p>
            Apple sapling pre-orders are reserved based on nursery graft scheduling. Dispatches occur during the dormant planting window between December and March.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground font-serif">2. Intellectual Property</h3>
          <p>
            All content, high-density calculators, tree selection matrices, and rootstock comparative data belong exclusively to Orchard E-Commerce Platform.
          </p>
        </div>
      </Card>
    </div>
  );
}
