"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart";
import { toast } from "sonner";
import { ShoppingBag, Minus, Plus, Heart, Zap } from "lucide-react";
import { toggleWishlistAction } from "@/actions/wishlist";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleAddToCart = async () => {
    if (stock <= 0) return;
    setLoading(true);
    try {
      const res = await addToCartAction(productId, undefined, quantity);
      if (res.success) {
        toast.success("Added to shopping cart!");
      } else {
        toast.error(res.error || "Please sign in to add items to cart.");
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (stock <= 0) return;
    setBuyNowLoading(true);
    try {
      const res = await addToCartAction(productId, undefined, quantity);
      if (res.success) {
        toast.success("Proceeding to checkout...");
        router.push("/checkout");
      } else {
        toast.error(res.error || "Please sign in to proceed to checkout.");
      }
    } catch {
      toast.error("Buy Now action failed");
    } finally {
      setBuyNowLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    setWishlistLoading(true);
    try {
      const res = await toggleWishlistAction(productId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Please sign in to modify wishlist.");
      }
    } catch {
      toast.error("Wishlist action failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Stepper & Add to Cart */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border bg-background/50 p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || stock <= 0}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center text-sm font-bold">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= stock || stock <= 0}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Button
          size="lg"
          variant="outline"
          className="flex-1 rounded-2xl gap-2 font-bold"
          onClick={handleAddToCart}
          isLoading={loading}
          disabled={stock <= 0}
        >
          <ShoppingBag className="h-4 w-4" />
          {stock > 0 ? "Add To Cart" : "Sold Out"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-2xl shrink-0"
          onClick={handleToggleWishlist}
          isLoading={wishlistLoading}
        >
          <Heart className="h-5 w-5 text-destructive" />
        </Button>
      </div>

      {/* Buy Now Direct Checkout Button */}
      <Button
        size="lg"
        className="w-full rounded-2xl gap-2 font-bold shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700"
        onClick={handleBuyNow}
        isLoading={buyNowLoading}
        disabled={stock <= 0}
      >
        <Zap className="h-4 w-4 fill-current" />
        Buy Now (Instant Checkout)
      </Button>
    </div>
  );
}
