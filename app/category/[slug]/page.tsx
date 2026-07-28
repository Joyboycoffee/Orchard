import { getProductsAction } from "@/actions/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Star, ArrowRight, TreePine, ShieldCheck, Award } from "lucide-react";

const categoryMeta: Record<string, { title: string; subtitle: string; bgImage: string; description: string }> = {
  "fresh-apples": {
    title: "Fresh High-Altitude Apples",
    subtitle: "Handpicked 7,500 ft Elevation",
    bgImage: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1200&q=80",
    description: "Crisp, organic apples grown in Kullu Valley. Harvested at peak ripeness and shipped in cold-chain molded pulp crates.",
  },
  "apple-trees": {
    title: "Commercial Apple Trees & Saplings",
    subtitle: "2-Year Knip-boom Feathered Trees",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    description: "High-density feathered saplings with 5+ side branches, pre-conditioned for early cropping in commercial orchards.",
  },
  rootstocks: {
    title: "Certified Clonal Rootstocks",
    subtitle: "Dutch Import & Geneva Resistance",
    bgImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
    description: "Virus-indexed dwarfing rootstocks (M9 T337, Geneva G11/G41, MM106) for bench grafting and high-density planting.",
  },
  "gardening-accessories": {
    title: "Gardening & Secateurs Equipment",
    subtitle: "Japanese SK5 Carbon Steel Pruners",
    bgImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
    description: "Professional orchard equipment including SK5 bypass secateurs, grafting tape, parafilm, and trellis wire systems.",
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = categoryMeta[slug] || {
    title: slug.replace("-", " ").toUpperCase(),
    subtitle: "Orchard Specialty Category",
    bgImage: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1200&q=80",
    description: "Browse our certified category offerings.",
  };

  const res = await getProductsAction({ categorySlug: slug, limit: 12 });
  const catData: any = res.data;
  const products: any[] = Array.isArray(catData?.products) ? catData.products : [];

  return (
    <div className="space-y-12 pb-16">
      {/* Category Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/15 via-background to-background pt-12 pb-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 lg:p-12 border border-white/20 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <Badge variant="glass">{meta.subtitle}</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold font-serif text-foreground">
                {meta.title}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {meta.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Certified Virus-Free</span>
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> 100% Growth Guarantee</span>
              </div>
            </div>

            <div className="h-48 w-full lg:w-80 rounded-2xl overflow-hidden glass-card border bg-muted">
              <img src={meta.bgImage} alt={meta.title} className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-serif">Available Products ({products.length})</h2>
          <Link href="/products">
            <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-1">
              All Products <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-4">
            <p className="font-bold text-lg">No products available in this category yet</p>
            <p className="text-xs text-muted-foreground">Check back soon or browse all products in our catalog.</p>
            <Link href="/products">
              <Button size="sm" className="rounded-xl">Explore All Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="glass-card overflow-hidden rounded-3xl flex flex-col group border">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <img
                    src={
                      product.images[0]?.url ||
                      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.salePrice && (
                    <Badge variant="destructive" className="absolute top-3 left-3 font-bold">
                      Sale
                    </Badge>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{product.category?.name}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{product.averageRating}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <span className="text-lg font-bold text-foreground">
                        {formatCurrency(product.salePrice || product.basePrice)}
                      </span>
                    </div>

                    <Link href={`/products/${product.slug}`}>
                      <Button size="sm" className="rounded-xl">
                        View Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
