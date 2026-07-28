import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, ThermometerSnowflake, Mountain, Droplets, ArrowRight } from "lucide-react";

export default function TreeGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline">Interactive Orchard Selector</Badge>
        <h1 className="text-4xl font-bold font-serif">Apple Tree Selection Matrix</h1>
        <p className="text-sm text-muted-foreground">
          Select your orchard parameters to determine ideal apple varieties and rootstock combinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card rounded-3xl p-6 border space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <ThermometerSnowflake className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg font-serif">1. Chilling Hours</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            High chilling (800+ hrs) suitable for Honeycrisp, Gala, and Fuji above 6,000 ft elevation. Low-chill varieties (300 hrs) for sub-tropical valleys.
          </p>
        </Card>

        <Card className="glass-card rounded-3xl p-6 border space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Mountain className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg font-serif">2. Elevation & Slope</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Steep slopes require deeper anchoring rootstocks like MM106 or M7, whereas flat terrace lands excel with M9 T337 high-density systems.
          </p>
        </Card>

        <Card className="glass-card rounded-3xl p-6 border space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Droplets className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg font-serif">3. Drip Irrigation</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dwarfing rootstocks (M9, G11) require drip irrigation lines with fertigation dosing. Un-irrigated soils perform best on MM106 roots.
          </p>
        </Card>
      </div>

      <div className="glass-panel rounded-3xl p-8 border text-center space-y-4 bg-primary/5">
        <h2 className="text-2xl font-bold font-serif">Ready to order your feathered saplings?</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Explore our certified 2-year Knip-boom trees with 5+ premature branches.
        </p>
        <Link href="/products?category=apple-trees">
          <Button size="lg" className="rounded-2xl font-bold gap-2">
            View Sapling Catalog <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
