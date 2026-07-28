"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart";
import { toast } from "sonner";
import { ShoppingBag, Minus, Plus, Heart } from "lucide-react";
import { toggleWishlistAction } from "@/actions/wishlist";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
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
      <div className="flex items-center gap-4">
        {/* Quantity Stepper */}
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

        {/* Add to Cart Button */}
        <Button
          size="lg"
          className="flex-1 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20"
          onClick={handleAddToCart}
          isLoading={loading}
          disabled={stock <= 0}
        >
          <ShoppingBag className="h-5 w-5" />
          {stock > 0 ? "Add To Shopping Cart" : "Sold Out"}
        </Button>

        {/* Wishlist Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-13 w-13 rounded-2xl shrink-0"
          onClick={handleToggleWishlist}
          isLoading={wishlistLoading}
        >
          <Heart className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
