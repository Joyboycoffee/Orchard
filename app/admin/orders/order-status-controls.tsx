"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOrderStatusAction } from "@/actions/admin";
import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

interface OrderStatusControlsProps {
  orderId: string;
  currentStatus: OrderStatus;
  trackingNumber: string;
  courierName: string;
}

export function OrderStatusControls({
  orderId,
  currentStatus,
  trackingNumber: initialTracking,
  courierName: initialCourier,
}: OrderStatusControlsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [tracking, setTracking] = useState(initialTracking);
  const [courier, setCourier] = useState(initialCourier);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateOrderStatusAction(orderId, status, tracking, courier);
      if (res.success) {
        toast.success("Order status updated successfully!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update order");
      }
    } catch {
      toast.error("Error updating order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-3 border-t grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase">Fulfillment Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full h-9 px-3 rounded-xl border bg-background text-xs font-semibold"
        >
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase">Courier Partner</label>
        <Input
          placeholder="e.g. Delhivery, Bluedart"
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          className="h-9 text-xs rounded-xl"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-muted-foreground uppercase">Tracking Number</label>
        <Input
          placeholder="e.g. AWB987654321"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="h-9 text-xs rounded-xl"
        />
      </div>

      <Button
        size="sm"
        className="rounded-xl text-xs font-bold"
        onClick={handleUpdate}
        isLoading={loading}
      >
        Update Status
      </Button>
    </div>
  );
}
