import Link from "next/link";
import { getCartAction } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, ArrowRight, Trash2, Tag, ShieldCheck } from "lucide-react";
import { CartItemControls } from "./cart-item-controls";

export default async function CartPage() {
  const res = await getCartAction();

  if (!res.success || !res.data || res.data.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-serif">Your Cart is Empty</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You haven't added any fresh apples, saplings, or gardening tools to your cart yet.
          </p>
        </div>
        <Link href="/products">
          <Button size="lg" className="rounded-2xl font-bold gap-2">
            Browse Nursery Catalog <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const { items, subtotal } = res.data;
  const shippingFee = subtotal >= 1999 ? 0 : 150;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-bold font-serif">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => {
            const price = item.variant?.salePrice || item.variant?.price || item.product.salePrice || item.product.basePrice;
            const primaryImage =
              item.product.images?.find((i: any) => i.isPrimary)?.url ||
              item.product.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80";

            return (
              <Card key={item.id} className="glass-card p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-muted">
                    <img src={primaryImage} alt={item.product.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <Link href={`/products/${item.product.slug}`} className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-1">
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground mt-0.5">Variant: {item.variant.name}</p>
                    )}
                    <p className="text-sm font-bold text-primary mt-1">{formatCurrency(price)}</p>
                  </div>
                </div>

                <CartItemControls cartItemId={item.id} initialQuantity={item.quantity} />
              </Card>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border space-y-6">
            <h3 className="font-bold text-lg font-serif text-foreground">Order Summary</h3>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" /> Promo / Coupon Code
              </label>
              <div className="flex gap-2">
                <Input placeholder="Try WELCOME10" className="rounded-xl text-xs" />
                <Button variant="secondary" size="sm" className="rounded-xl text-xs">
                  Apply
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}</span>
              </div>
              {subtotal < 1999 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  Add {formatCurrency(1999 - subtotal)} more for FREE shipping!
                </p>
              )}
              <div className="flex justify-between pt-3 border-t text-base font-bold">
                <span>Grand Total</span>
                <span className="text-primary text-xl">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Safe 256-Bit SSL Encrypted Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
