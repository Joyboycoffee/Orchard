import { getProductBySlugAction } from "@/actions/products";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, calculateDiscountPercentage } from "@/lib/utils";
import { Star, Truck, ShieldCheck, Heart, Share2, CheckCircle2, TreePine, MapPin } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getProductBySlugAction(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const product = res.data;
  const primaryImage =
    product.images.find((i: any) => i.isPrimary)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80";

  const discount = calculateDiscountPercentage(product.basePrice, product.salePrice || product.basePrice);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden glass-card border bg-muted">
            <img
              src={primaryImage}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            {discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4 text-sm font-bold">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any) => (
                <div
                  key={img.id}
                  className="h-20 w-20 shrink-0 rounded-2xl overflow-hidden glass-card border bg-muted cursor-pointer hover:border-primary transition-all"
                >
                  <img src={img.url} alt={img.altText || product.name} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category?.name}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
              {product.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="h-4 w-4 fill-current" />
              <span>{product.averageRating}</span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-medium text-muted-foreground">
              {product.reviewCount} Verified Customer Reviews
            </span>
          </div>

          {/* Price Box */}
          <div className="glass-panel p-5 rounded-2xl border flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {formatCurrency(product.salePrice || product.basePrice)}
                </span>
                {product.salePrice && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatCurrency(product.basePrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                Inclusive of all taxes & temperature-controlled packaging
              </p>
            </div>

            <Badge variant={product.stockQuantity > 0 ? "success" : "destructive"}>
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          {/* Orchard Technical Attributes */}
          {(product.variety || product.rootstockType || product.chillingHours || product.diseaseResistance) && (
            <div className="glass-card rounded-2xl p-4 border space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Orchard Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.variety && (
                  <div>
                    <span className="text-muted-foreground">Variety: </span>
                    <span className="font-semibold text-foreground">{product.variety}</span>
                  </div>
                )}
                {product.rootstockType && (
                  <div>
                    <span className="text-muted-foreground">Rootstock: </span>
                    <span className="font-semibold text-foreground">{product.rootstockType}</span>
                  </div>
                )}
                {product.chillingHours && (
                  <div>
                    <span className="text-muted-foreground">Chilling Hours: </span>
                    <span className="font-semibold text-foreground">{product.chillingHours} hrs</span>
                  </div>
                )}
                {product.diseaseResistance && (
                  <div>
                    <span className="text-muted-foreground">Resistance: </span>
                    <span className="font-semibold text-foreground">{product.diseaseResistance}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description Snippet */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Add to Cart Actions */}
          <div className="pt-2">
            <AddToCartButton productId={product.id} stock={product.stockQuantity} />
          </div>

          {/* Pincode & Delivery Checker */}
          <div className="glass-card rounded-2xl p-4 border space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Check Express Delivery & Pincode Serviceability</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode (e.g. 175131)"
                className="flex-1 h-10 px-3 rounded-xl border bg-background text-xs"
              />
              <Button size="sm" variant="secondary" className="rounded-xl text-xs">
                Check
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Information Section */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border space-y-6">
        <h3 className="text-2xl font-bold font-serif">Detailed Information & Care Instructions</h3>
        <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {product.description}
        </div>
      </div>
    </div>
  );
}
