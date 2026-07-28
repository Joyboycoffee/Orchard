"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { createOrderAction } from "@/actions/orders";
import { toast } from "sonner";
import { MapPin, CreditCard, Banknote, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { PaymentMethod } from "@prisma/client";

interface CheckoutFormProps {
  user: any;
  items: any[];
  subtotal: number;
}

export function CheckoutForm({ user, items, subtotal }: CheckoutFormProps) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.addresses[0]?.id || ""
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.RAZORPAY);
  const [loading, setLoading] = useState(false);

  const shippingFee = subtotal >= 1999 ? 0 : 150;
  const grandTotal = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a shipping address.");
      return;
    }

    setLoading(true);
    try {
      const res = await createOrderAction({
        addressId: selectedAddressId,
        paymentMethod,
      });

      if (res.success && res.data) {
        toast.success("Order placed successfully!");
        router.push(`/orders/${res.data.id}`);
      } else {
        toast.error(res.error || "Failed to place order.");
      }
    } catch {
      toast.error("An unexpected error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* 1. Select Delivery Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              1
            </div>
            <h2 className="text-xl font-bold font-serif">Delivery Address</h2>
          </div>

          {user.addresses.length === 0 ? (
            <Card className="glass-card p-6 rounded-2xl text-center space-y-3">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold">No saved addresses found</p>
              <p className="text-xs text-muted-foreground">Please add an address in your account settings before checkout.</p>
              <Button size="sm" onClick={() => router.push("/dashboard")}>
                Add Address
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr: any) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-sm text-foreground">{addr.fullName}</span>
                    {selectedAddressId === addr.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Select Payment Method */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              2
            </div>
            <h2 className="text-xl font-bold font-serif">Payment Method</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod(PaymentMethod.RAZORPAY)}
              className={`glass-card p-5 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all ${
                paymentMethod === PaymentMethod.RAZORPAY
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Razorpay Gateway</h4>
                <p className="text-xs text-muted-foreground">UPI, Credit/Debit Cards, NetBanking</p>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY)}
              className={`glass-card p-5 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all ${
                paymentMethod === PaymentMethod.CASH_ON_DELIVERY
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Cash On Delivery (COD)</h4>
                <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Summary */}
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 border space-y-6">
          <h3 className="font-bold text-lg font-serif">Order Summary</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => {
              const price = item.variant?.salePrice || item.variant?.price || item.product.salePrice || item.product.basePrice;
              return (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="line-clamp-1 text-muted-foreground">{item.quantity}x {item.product.name}</span>
                  <span className="font-bold">{formatCurrency(price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-4 border-t text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t text-base font-bold">
              <span>Total Payable</span>
              <span className="text-primary text-xl">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20"
            onClick={handlePlaceOrder}
            isLoading={loading}
          >
            Place Order Now <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
