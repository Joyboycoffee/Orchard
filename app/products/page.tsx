import Link from "next/link";
import { getProductsAction } from "@/actions/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Star, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const categorySlug = params.category;
  const search = params.q;
  const sortBy = (params.sort as any) || "newest";

  const res = await getProductsAction({
    categorySlug,
    search,
    sortBy,
    limit: 20,
  });

  const products = res.data?.products || [];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">
            {categorySlug ? categorySlug.replace("-", " ").toUpperCase() : "Catalog & Nursery"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse certified high-density fruit trees, virus-indexed rootstocks & organic produce.
          </p>
        </div>

        {/* Search & Filter bar */}
        <form className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={search || ""}
              placeholder="Search Honeycrisp, M9, Secateurs..."
              className="pl-9 rounded-xl"
            />
          </div>
          <Button type="submit" variant="default" className="rounded-xl">
            Search
          </Button>
        </form>
      </div>

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Categories", href: "/products" },
            { label: "Fresh Apples", href: "/products?category=fresh-apples" },
            { label: "Apple Trees", href: "/products?category=apple-trees" },
            { label: "Rootstocks", href: "/products?category=rootstocks" },
            { label: "Gardening Supplies", href: "/products?category=gardening-accessories" },
          ].map((cat) => (
            <Link key={cat.label} href={cat.href}>
              <Badge
                variant={categorySlug === cat.href.split("=")[1] || (!categorySlug && cat.href === "/products") ? "default" : "outline"}
                className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {cat.label}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Sort by:</span>
          <div className="flex gap-1">
            <Link href={`/products?sort=newest${categorySlug ? `&category=${categorySlug}` : ""}`}>
              <Button variant={sortBy === "newest" ? "secondary" : "ghost"} size="sm" className="text-xs rounded-lg">
                Newest
              </Button>
            </Link>
            <Link href={`/products?sort=price_asc${categorySlug ? `&category=${categorySlug}` : ""}`}>
              <Button variant={sortBy === "price_asc" ? "secondary" : "ghost"} size="sm" className="text-xs rounded-lg">
                Price: Low to High
              </Button>
            </Link>
            <Link href={`/products?sort=price_desc${categorySlug ? `&category=${categorySlug}` : ""}`}>
              <Button variant={sortBy === "price_desc" ? "secondary" : "ghost"} size="sm" className="text-xs rounded-lg">
                Price: High to Low
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl space-y-4">
          <p className="text-lg font-bold">No products found</p>
          <p className="text-sm text-muted-foreground">Try clearing search terms or selecting a different category.</p>
          <Link href="/products">
            <Button variant="default" className="rounded-xl">View All Products</Button>
          </Link>
        </div>
      ) : (
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
      )}
    </div>
  );
}
