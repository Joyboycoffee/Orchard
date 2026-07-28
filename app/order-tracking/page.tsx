"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, MapPin, Truck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;

    setLoading(true);
    setTimeout(() => {
      setSearchResult({
        orderNumber: orderNumber.toUpperCase().trim(),
        status: "SHIPPED",
        courier: "Delhivery Cold-Express",
        trackingId: "AWB" + Math.floor(10000000 + Math.random() * 90000000),
        estimatedDelivery: "2-3 Days",
        origin: "Kullu Nursery Estate, HP",
        destination: "Customer Destination",
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="outline">Live Logistics</Badge>
        <h1 className="text-4xl font-bold font-serif">Track Your Order</h1>
        <p className="text-sm text-muted-foreground">
          Enter your Order Number (e.g. ORCH-20260727-8942) to view real-time transit status.
        </p>
      </div>

      <Card className="glass-card rounded-3xl p-6 lg:p-8 border space-y-6">
        <form onSubmit={handleTrack} className="flex gap-3">
          <Input
            required
            placeholder="Enter Order Number (e.g. ORCH-20260727-8942)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="rounded-xl text-sm"
          />
          <Button type="submit" size="lg" className="rounded-xl font-bold gap-2" isLoading={loading}>
            <Search className="h-4 w-4" /> Track
          </Button>
        </form>

        {searchResult && (
          <div className="pt-6 border-t space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Order ID</span>
                <p className="font-bold font-mono text-base">{searchResult.orderNumber}</p>
              </div>
              <Badge variant="success" className="px-3 py-1">
                {searchResult.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="glass-panel p-3 rounded-xl">
                <span className="text-muted-foreground">Courier Partner</span>
                <p className="font-bold text-foreground mt-0.5">{searchResult.courier}</p>
              </div>
              <div className="glass-panel p-3 rounded-xl">
                <span className="text-muted-foreground">Tracking AWB</span>
                <p className="font-mono font-bold text-foreground mt-0.5">{searchResult.trackingId}</p>
              </div>
              <div className="glass-panel p-3 rounded-xl">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{searchResult.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
