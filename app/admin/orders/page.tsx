import { getAdminOrdersAction } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusControls } from "./order-status-controls";

export default async function AdminOrdersPage() {
  const res = await getAdminOrdersAction();
  const orders = res.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif">Order Fulfillment & Logistics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage customer purchases, update delivery status, and assign courier tracking numbers.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.id} className="glass-card rounded-3xl p-6 border space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base font-mono">{order.orderNumber}</span>
                  <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                    Payment: {order.paymentStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Customer: {order.user.fullName} ({order.user.email}) • Placed: {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Items snippet */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-muted-foreground uppercase tracking-wider">Items in Order:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between bg-muted/30 p-2 rounded-xl">
                    <span>{item.quantity}x {item.productName}</span>
                    <span className="font-bold">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update Control */}
            <OrderStatusControls
              orderId={order.id}
              currentStatus={order.orderStatus}
              trackingNumber={order.trackingNumber || ""}
              courierName={order.courierName || ""}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
