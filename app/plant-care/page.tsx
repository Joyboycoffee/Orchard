import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sun, Snowflake, CloudRain, Sparkles } from "lucide-react";

export default function PlantCarePage() {
  const seasons = [
    {
      season: "Winter (Dec - Feb)",
      title: "Dormancy, Pruning & Bench Grafting",
      icon: Snowflake,
      badge: "Crucial Stage",
      tasks: [
        "Perform structural winter pruning on central leader tall spindle trees.",
        "Apply copper oxychloride dormant spray to eliminate scab spores.",
        "Bench-graft scion wood onto M9 T337 clonal rootstocks.",
      ],
    },
    {
      season: "Spring (Mar - May)",
      title: "Bud Break, Flowering & Pollination",
      icon: Sparkles,
      badge: "High Activity",
      tasks: [
        "Deploy honeybee hives (2 hives/acre) during 20% bloom stage.",
        "Apply calcium nitrate foliar sprays to prevent bitter pit in Honeycrisp.",
        "Check soil moisture and activate drip fertigation schedules.",
      ],
    },
    {
      season: "Summer (Jun - Aug)",
      title: "Fruit Thinning & Pest Management",
      icon: Sun,
      badge: "Yield Protection",
      tasks: [
        "Hand-thin fruitlets to 1 fruit per cluster for maximum size class (80mm+).",
        "Install hail nets over high-density canopy structures.",
        "Monitor for red spider mite and woolly apple aphid outbreaks.",
      ],
    },
    {
      season: "Autumn (Sep - Nov)",
      title: "Harvest, Grading & Post-Harvest Storage",
      icon: CloudRain,
      badge: "Harvest Peak",
      tasks: [
        "Harvest Honeycrisp & Gala apples based on starch-iodine index maturity tests.",
        "Transfer fresh produce into cold-chain storage at 1°C - 2°C.",
        "Apply post-harvest zinc + boron sprays for next season bud strength.",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline">Seasonal Orchard Management</Badge>
        <h1 className="text-4xl font-bold font-serif">Year-Round Apple Plant Care Calendar</h1>
        <p className="text-sm text-muted-foreground">
          Follow our high-altitude commercial orchard calendar for maximum fruit size, scab control, and tree longevity.
        </p>
      </div>

      <div className="space-y-6">
        {seasons.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.season} className="glass-card rounded-3xl p-6 lg:p-8 border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif">{s.season}</h3>
                    <p className="text-xs text-muted-foreground">{s.title}</p>
                  </div>
                </div>
                <Badge variant="glass">{s.badge}</Badge>
              </div>

              <div className="pl-13 space-y-2 text-xs">
                {s.tasks.map((task) => (
                  <div key={task} className="flex items-start gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
