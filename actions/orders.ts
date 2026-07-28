"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse, generateOrderNumber } from "@/lib/utils";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

export interface CreateOrderInput {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

/**
 * Server Action: Checkout and Create Order from Cart
 */
export async function createOrderAction(input: CreateOrderInput) {
  try {
    const session = await requireAuth();

    // 1. Fetch Cart with Items
    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return createErrorResponse("Your shopping cart is empty.");
    }

    // 2. Calculate Order Totals
    let subtotal = 0;
    const orderItemsData = cart.items.map((item) => {
      const price = item.variant?.salePrice || item.variant?.price || item.product.salePrice || item.product.basePrice;
      const total = price * item.quantity;
      subtotal += total;

      return {
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        variantName: item.variant?.name || null,
        price,
        quantity: item.quantity,
        total,
      };
    });

    // Shipping Fee (Free above ₹1,999)
    const shippingFee = subtotal >= 1999 ? 0 : 150;
    let discountAmount = 0;

    // Apply Coupon if provided
    if (input.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.couponCode, isActive: true },
      });

      if (coupon && new Date() <= coupon.endDate && subtotal >= coupon.minOrderAmount) {
        if (coupon.type === "PERCENTAGE") {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
          }
        } else if (coupon.type === "FIXED_AMOUNT") {
          discountAmount = coupon.discountValue;
        } else if (coupon.type === "FREE_SHIPPING") {
          discountAmount = shippingFee;
        }

        // Increment coupon usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);
    const orderNumber = generateOrderNumber();

    // 3. Create Order Record in DB
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.userId,
        addressId: input.addressId,
        paymentMethod: input.paymentMethod,
        orderStatus: OrderStatus.CONFIRMED,
        paymentStatus: input.paymentMethod === PaymentMethod.CASH_ON_DELIVERY ? PaymentStatus.PENDING : PaymentStatus.PAID,
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
        couponCode: input.couponCode || null,
        notes: input.notes || null,
        items: {
          create: orderItemsData,
        },
        payments: {
          create: {
            amount: totalAmount,
            status: input.paymentMethod === PaymentMethod.CASH_ON_DELIVERY ? PaymentStatus.PENDING : PaymentStatus.PAID,
          },
        },
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    // 4. Update product stock levels
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    // 5. Clear Cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createSuccessResponse(newOrder, "Order placed successfully!");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to place order";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Get User Orders
 */
export async function getUserOrdersAction() {
  try {
    const session = await requireAuth();

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true } } } },
          },
        },
        shippingAddress: true,
      },
    });

    return createSuccessResponse(orders);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch orders";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Get Order Detail by ID
 */
export async function getOrderByIdAction(orderId: string) {
  try {
    const session = await requireAuth();

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.userId },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true } } } },
          },
        },
        shippingAddress: true,
        payments: true,
      },
    });

    if (!order) return createErrorResponse("Order not found");
    return createSuccessResponse(order);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch order detail";
    return createErrorResponse(errMessage);
  }
}
