"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

/**
 * Server Action: Get Admin Analytics Metrics
 */
export async function getAdminDashboardStatsAction() {
  try {
    await requireAdmin();

    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      recentOrders,
      orderStatusCounts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.product.count({ where: { stockQuantity: { lte: 10 }, isDeleted: false } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, email: true } } },
      }),
      prisma.order.groupBy({
        by: ["orderStatus"],
        _count: { id: true },
      }),
    ]);

    const revenueAggregation = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "PAID" },
    });

    const totalRevenue = revenueAggregation._sum.totalAmount || 0;

    return createSuccessResponse({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      recentOrders,
      orderStatusCounts,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to load dashboard metrics";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Admin Update Order Status
 */
export async function updateOrderStatusAction(orderId: string, status: OrderStatus, trackingNumber?: string, courierName?: string) {
  try {
    const admin = await requireAdmin();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: status,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: "UPDATE_ORDER_STATUS",
        entity: "Order",
        entityId: orderId,
        details: { status, trackingNumber, courierName },
      },
    });

    return createSuccessResponse(updatedOrder, "Order status updated");
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update order status";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Admin Fetch All Orders
 */
export async function getAdminOrdersAction() {
  try {
    await requireAdmin();

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
        shippingAddress: true,
        items: true,
      },
    });

    return createSuccessResponse(orders);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch admin orders";
    return createErrorResponse(errMessage);
  }
}

/**
 * Server Action: Admin Fetch Audit Logs
 */
export async function getAdminAuditLogsAction() {
  try {
    await requireAdmin();

    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true, email: true } } },
    });

    return createSuccessResponse(logs);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch audit logs";
    return createErrorResponse(errMessage);
  }
}
