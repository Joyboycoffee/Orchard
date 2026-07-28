import { getOrderByIdAction } from "@/actions/orders";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckCircle2, Package, MapPin, CreditCard, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getOrderByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const order: any = res.data;

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border bg-emerald-500/5 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-serif text-foreground">Order Confirmed!</h1>
          <p className="text-sm text-muted-foreground">
            Thank you for your order. We are preparing your plants/produce with cold-chain care.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-mono font-bold">
          <span>Order Number: {order.orderNumber}</span>
        </div>
      </div>

      {/* Order Status Stepper */}
      <Card className="glass-card rounded-3xl p-6 border space-y-4">
        <h3 className="font-bold text-base font-serif">Fulfillment Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { step: "Confirmed", status: "CONFIRMED", active: true },
            { step: "Processing", status: "PROCESSING", active: order.orderStatus !== "PENDING" },
            { step: "Shipped", status: "SHIPPED", active: ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.orderStatus) },
            { step: "Delivered", status: "DELIVERED", active: order.orderStatus === "DELIVERED" },
          ].map((s) => (
            <div key={s.step} className={`p-3 rounded-2xl border text-xs font-semibold ${s.active ? "bg-primary/10 border-primary text-primary" : "opacity-40"}`}>
              {s.step}
            </div>
          ))}
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items Purchased */}
        <Card className="glass-card rounded-3xl p-6 border space-y-4">
          <h3 className="font-bold text-base font-serif flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" /> Items Purchased
          </h3>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-xs border-b pb-2">
                <div>
                  <p className="font-bold text-foreground">{item.productName}</p>
                  {item.variantName && <p className="text-muted-foreground">{item.variantName}</p>}
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 flex justify-between font-bold text-sm">
            <span>Total Paid</span>
            <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
          </div>
        </Card>

        {/* Shipping & Payment info */}
        <Card className="glass-card rounded-3xl p-6 border space-y-4">
          <h3 className="font-bold text-base font-serif flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Delivery Address
          </h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p className="font-mono">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="pt-4 border-t space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" /> Payment Method
            </h4>
            <div className="flex items-center justify-between text-xs">
              <span>{order.paymentMethod}</span>
              <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                {order.paymentStatus}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-xl gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" /> Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
