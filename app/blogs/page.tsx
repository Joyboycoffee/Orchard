import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, ArrowRight, User } from "lucide-react";

export default async function BlogsPage() {
  const blogs = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { fullName: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline">Orchard Knowledge CMS</Badge>
        <h1 className="text-4xl font-bold font-serif">Articles, Pruning & Rootstock Guides</h1>
        <p className="text-sm text-muted-foreground">
          Expert articles on high-density orchard establishment, fertigation schedules, and canopy management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Card key={blog.id} className="glass-card rounded-3xl overflow-hidden border flex flex-col justify-between">
            <div className="space-y-4">
              {blog.coverImage && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img src={blog.coverImage} alt={blog.title} className="object-cover w-full h-full" />
                </div>
              )}

              <div className="p-6 space-y-3">
                <Badge variant="glass">{blog.category}</Badge>
                <h3 className="font-bold text-lg font-serif line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>{blog.author.fullName}</span>
              </div>
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
