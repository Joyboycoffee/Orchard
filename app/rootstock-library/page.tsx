import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Check, ShieldCheck, TreePine, ArrowRight } from "lucide-react";

export default function RootstockLibraryPage() {
  const rootstocks = [
    {
      name: "M9 T337 Clonal Rootstock",
      type: "Dwarf (30-35% standard size)",
      origin: "Naktuinbouw, Netherlands (Virus Indexed)",
      description: "The global benchmark dwarfing rootstock for high-density apple orchards (1,200 to 1,500 trees/acre). Early fruit precocity by Year 2.",
      pros: ["Early crop production", "High fruit size uniformity", "Requires minimal canopy pruning"],
      cons: ["Requires full wire trellis support", "Sensitive to woolly apple aphid"],
      recommendedSpacing: "3.5 ft x 10 ft",
    },
    {
      name: "Geneva G11 / G41 Resistant Series",
      type: "Dwarf / Semi-Dwarf (35-40% standard size)",
      origin: "Cornell University, USA",
      description: "Bred for extreme resistance to Fire Blight (Erwinia amylovora), Crown Rot (Phytophthora), and Apple Replant Disease.",
      pros: ["Immune to Fire Blight & Replant Disease", "High cold hardiness", "Robust root anchorage"],
      cons: ["Higher royalty / sapling cost"],
      recommendedSpacing: "4 ft x 10 ft",
    },
    {
      name: "MM106 Clonal Rootstock",
      type: "Semi-Dwarf (60-65% standard size)",
      origin: "East Malling & Long Ashton, UK",
      description: "Ideal for traditional un-irrigated mountain terrain. Deep anchorage system with excellent drought tolerance.",
      pros: ["Self-anchoring (trellis optional)", "Woolly apple aphid resistant", "High drought tolerance"],
      cons: ["Delayed fruiting (Year 4)", "Susceptible to Phytophthora in poorly drained soils"],
      recommendedSpacing: "8 ft x 12 ft",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline">Educational Nursery Guide</Badge>
        <h1 className="text-4xl font-bold font-serif">Dutch & Geneva Rootstock Library</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Comprehensive scientific comparison of dwarfing and semi-dwarfing clonal rootstocks certified for high-density apple cultivation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rootstocks.map((rs) => (
          <Card key={rs.name} className="glass-card rounded-3xl p-6 border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Badge variant="glass" className="mb-1">{rs.type}</Badge>
                <h3 className="text-xl font-bold font-serif">{rs.name}</h3>
                <p className="text-xs text-primary font-mono">{rs.origin}</p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{rs.description}</p>

              <div className="space-y-2 pt-2 border-t text-xs">
                <p className="font-bold text-foreground">Key Advantages:</p>
                {rs.pros.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="text-xs text-muted-foreground">
                <span>Recommended Spacing: </span>
                <span className="font-bold text-foreground">{rs.recommendedSpacing}</span>
              </div>

              <Link href="/products?category=rootstocks">
                <Button size="sm" className="w-full rounded-xl gap-2 text-xs">
                  Shop Available Liners <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
