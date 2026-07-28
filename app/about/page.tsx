import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreePine, Award, ShieldCheck, Truck, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="outline">About Orchard</Badge>
        <h1 className="text-4xl font-bold font-serif">Pioneering High-Altitude Apple Farming</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Founded in Kullu Valley, Himachal Pradesh, Orchard is an investor-backed e-commerce platform committed to modernizing apple agriculture. We bridge European nursery innovation with Asian growers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card rounded-3xl p-8 border space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold font-serif">Dutch Virus-Indexed Clonal Stock</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our nursery imports certified virus-indexed Dutch M9 T337 and Geneva rootstock liners directly from accredited European propagation facilities. Every plant undergo DNA variety profiling and phytosanitary screening.
          </p>
        </Card>

        <Card className="glass-card rounded-3xl p-8 border space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold font-serif">Cold-Chain Temperature Control</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Whether delivering fresh organic Honeycrisp apples or dormant saplings in root-bags, our proprietary temperature-controlled packaging ensures zero transit shock.
          </p>
        </Card>
      </div>
    </div>
  );
}
