import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function AdminBlogsPage() {
  const blogs = [
    { id: "1", title: "Complete Guide to M9 T337 Rootstock Canopy Management", category: "Rootstock Library", views: 1420, date: "July 24, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Blog & Advisory CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Publish rootstock guides, pruning tutorials, and high-density planting knowledge.
          </p>
        </div>
        <Button size="sm" className="rounded-xl font-bold gap-2">
          <Plus className="h-4 w-4" /> New Article
        </Button>
      </div>

      <Card className="glass-card rounded-3xl p-6 border">
        <table className="w-full text-xs text-left">
          <thead className="border-b bg-muted/40 text-muted-foreground">
            <tr>
              <th className="p-3">Article Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Total Views</th>
              <th className="p-3">Published Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {blogs.map((b) => (
              <tr key={b.id} className="hover:bg-muted/20">
                <td className="p-3 font-bold text-foreground">{b.title}</td>
                <td className="p-3"><Badge variant="outline">{b.category}</Badge></td>
                <td className="p-3 font-mono">{b.views} reads</td>
                <td className="p-3 text-muted-foreground">{b.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
