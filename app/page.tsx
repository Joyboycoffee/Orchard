import Link from "next/link";
import { getProductsAction } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  TreePine,
  Sparkles,
  Zap,
  BookOpen,
  Award,
} from "lucide-react";

export default async function HomePage() {
  const featuredRes = await getProductsAction({ limit: 8, featuredOnly: true });
  const featuredData: any = featuredRes.data;
  const products = featuredData?.products || [];

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Certified Dutch M9 & Geneva Clonal Rootstocks</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-foreground leading-[1.15]">
                High-Density <span className="text-primary underline decoration-primary/30">Orchard</span> Excellence
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Direct from high-altitude Kullu nurseries. We supply virus-indexed feathered apple saplings, Dutch M9 rootstocks, organic Honeycrisp apples, and commercial pruning systems.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/products?category=apple-trees">
                  <Button size="lg" className="rounded-2xl gap-2 font-semibold shadow-lg shadow-primary/20">
                    Explore Saplings <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/rootstock-library">
                  <Button size="lg" variant="glass" className="rounded-2xl gap-2 font-semibold">
                    <BookOpen className="h-4 w-4" /> Rootstock Guide
                  </Button>
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="pt-8 border-t grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-bold text-foreground">100k+</p>
                  <p className="text-xs text-muted-foreground">Saplings Planted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">99.4%</p>
                  <p className="text-xs text-muted-foreground">Survival Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">A+ Grade</p>
                  <p className="text-xs text-muted-foreground">Dutch Certified</p>
                </div>
              </div>
            </div>

            {/* Right Hero Feature Display */}
            <div className="relative mx-auto max-w-md lg:max-w-none w-full">
              <div className="glass-card rounded-3xl p-6 lg:p-8 space-y-6 shadow- luxury border border-white/20">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1000&q=80"
                    alt="High Altitude Honeycrisp Orchard"
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-md">
                    2026 Harvest Open
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg font-serif">Kullu Royal Honeycrisp Box</h3>
                    <p className="text-xs text-muted-foreground">Handpicked 7,500 ft Elevation</p>
                  </div>
                  <span className="text-xl font-bold text-primary">{formatCurrency(399)}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>In Stock & Ready for Temperature-Controlled Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold font-serif">Shop by Specialty Category</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Everything you need for commercial orchard creation and fresh produce consumption.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Fresh Apples",
              count: "4 Varieties",
              href: "/products?category=fresh-apples",
              image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
              tag: "Fresh Harvest",
            },
            {
              title: "Apple Trees",
              count: "Feathered Saplings",
              href: "/products?category=apple-trees",
              image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
              tag: "High-Density",
            },
            {
              title: "Rootstocks",
              count: "M9, Geneva, MM106",
              href: "/products?category=rootstocks",
              image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
              tag: "Virus-Indexed",
            },
            {
              title: "Gardening & Secateurs",
              count: "Japanese SK5 Steel",
              href: "/products?category=gardening-accessories",
              image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
              tag: "Pro Equipment",
            },
          ].map((cat) => (
            <Link key={cat.title} href={cat.href}>
              <div className="group glass-card rounded-3xl overflow-hidden p-4 space-y-4 hover:border-primary/50 transition-all">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge variant="glass" className="absolute top-3 left-3">
                    {cat.tag}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-2">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{cat.count}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="outline" className="mb-2">
              Investor Grade Quality
            </Badge>
            <h2 className="text-3xl font-bold font-serif">Featured Nursery & Produce</h2>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-2 text-primary font-semibold">
              View All Products <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
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
                    {product.salePrice && (
                      <span className="text-xs text-muted-foreground line-through ml-2">
                        {formatCurrency(product.basePrice)}
                      </span>
                    )}
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
      </section>

      {/* ROOTSTOCK EDUCATIONAL BANNER */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 lg:p-12 relative overflow-hidden bg-gradient-to-r from-primary/20 via-background to-background border">
          <div className="max-w-2xl space-y-6 relative z-10">
            <Badge className="bg-primary text-primary-foreground">Interactive Tree Guide</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
              Unsure Which Rootstock Matches Your Orchard Elevation?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Explore our rootstock comparison tool (M9 T337 vs Geneva G11 vs MM106) based on soil compaction, chilling hours, and irrigation availability.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/tree-guide">
                <Button size="lg" className="rounded-2xl gap-2 font-semibold">
                  Launch Tree Selector <Zap className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/plant-care">
                <Button size="lg" variant="outline" className="rounded-2xl gap-2 font-semibold">
                  Plant Care Calendar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
