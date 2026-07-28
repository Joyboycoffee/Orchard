import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Award, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  const discussions = [
    {
      title: "M9 T337 vs Geneva G11 performance at 7,000 ft elevation in Himachal",
      author: "Rajesh Thakur (Kullu)",
      replies: 24,
      tag: "Rootstock Discussion",
    },
    {
      title: "Best drip fertigation formula for Gala feathered saplings in Year 2",
      author: "Sanjay Sharma (Kotkhai)",
      replies: 18,
      tag: "Fertigation & Soil",
    },
    {
      title: "Experience with Japanese SK5 SK-5 carbon steel secateurs for winter pruning",
      author: "Vikram Mehta (Shimla)",
      replies: 12,
      tag: "Pruning Tools",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="outline">Grower's Circle</Badge>
        <h1 className="text-4xl font-bold font-serif">Orchard Farmer & Grower Forum</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Connect with 5,000+ commercial apple growers sharing field observations on canopy training, scab protection, and Dutch rootstocks.
        </p>
      </div>

      <div className="space-y-4">
        {discussions.map((d) => (
          <Card key={d.title} className="glass-card rounded-2xl p-6 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <Badge variant="glass">{d.tag}</Badge>
              <h3 className="font-bold text-base font-serif hover:text-primary transition-colors cursor-pointer">{d.title}</h3>
              <p className="text-xs text-muted-foreground">Started by {d.author}</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground shrink-0">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>{d.replies} Replies</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
