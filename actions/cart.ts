"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/utils";

/**
 * Server Action: Get User Cart
 */
export async function getCartAction() {
  try {
    const session = await requireAuth();

    let cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true } } },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.userId },
        include: { items: { include: { product: { include: { images: true } }, variant: true } } },
      });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant?.salePrice || item.variant?.price || item.product.salePrice || item.product.basePrice;
      return sum + price * item.quantity;
    }, 0);

    return createSuccessResponse({
      id: cart.id,
      items: cart.items,
      itemCount: cart.items.reduce((total, i) => total + i.quantity, 0),
      subtotal,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to load cart";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Add Item to Cart
 */
export async function addToCartAction(productId: string, variantId?: string, quantity: number = 1) {
  try {
    const session = await requireAuth();

    let cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: session.userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
      });
    }

    return createSuccessResponse(null, "Item added to cart");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to add item to cart";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Update Cart Item Quantity
 */
export async function updateCartItemQuantityAction(cartItemId: string, quantity: number) {
  try {
    await requireAuth();

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    return createSuccessResponse(null, "Cart updated");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update cart";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Remove Cart Item
 */
export async function removeCartItemAction(cartItemId: string) {
  try {
    await requireAuth();
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return createSuccessResponse(null, "Item removed from cart");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to remove item";
    return createErrorResponse(errMessage);
  }
}
