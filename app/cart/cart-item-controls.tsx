"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateCartItemQuantityAction, removeCartItemAction } from "@/actions/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartItemControlsProps {
  cartItemId: string;
  initialQuantity: number;
}

export function CartItemControls({ cartItemId, initialQuantity }: CartItemControlsProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (newQty: number) => {
    setLoading(true);
    try {
      const res = await updateCartItemQuantityAction(cartItemId, newQty);
      if (res.success) {
        setQuantity(newQty);
        router.refresh();
      } else {
        toast.error("Failed to update cart");
      }
    } catch {
      toast.error("Error updating item quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      const res = await removeCartItemAction(cartItemId);
      if (res.success) {
        toast.success("Item removed");
        router.refresh();
      } else {
        toast.error("Failed to remove item");
      }
    } catch {
      toast.error("Error removing item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-xl border bg-background/50 p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={() => handleUpdate(quantity - 1)}
          disabled={loading || quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-xs font-bold">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={() => handleUpdate(quantity + 1)}
          disabled={loading}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive rounded-lg hover:bg-destructive/10"
        onClick={handleRemove}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
