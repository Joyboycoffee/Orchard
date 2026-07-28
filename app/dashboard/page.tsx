import { getFullDbUser } from "@/lib/auth";
import { getUserOrdersAction } from "@/actions/orders";
import { getWishlistAction } from "@/actions/wishlist";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { User, Package, Heart, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const user = await getFullDbUser();
  if (!user) redirect("/login?callbackUrl=/dashboard");

  const [ordersRes, wishlistRes] = await Promise.all([
    getUserOrdersAction(),
    getWishlistAction(),
  ]);

  const orders = ordersRes.data || [];
  const wishlistItems = wishlistRes.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 space-y-8">
      {/* Header Profile Bar */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl font-serif">
            {user.fullName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-foreground">{user.fullName}</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="mt-1 text-[10px]">
              {user.role} Account
            </Badge>
          </div>
        </div>

        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Orders */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Order History
          </h2>

          {orders.length === 0 ? (
            <Card className="glass-card p-8 rounded-3xl text-center space-y-3">
              <Package className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="font-bold">No orders placed yet</p>
              <p className="text-xs text-muted-foreground">Start exploring our high-density saplings and apples.</p>
              <Link href="/products">
                <Button size="sm" className="rounded-xl mt-2">
                  Browse Catalog
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id} className="glass-card p-5 rounded-2xl border space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs">
                    <div>
                      <span className="font-bold text-foreground">{order.orderNumber}</span>
                      <span className="text-muted-foreground ml-2">• {formatDate(order.createdAt)}</span>
                    </div>
                    <Badge variant={order.orderStatus === "DELIVERED" ? "success" : "outline"}>
                      {order.orderStatus}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{item.quantity}x {item.productName}</span>
                        <span className="font-bold">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <span className="font-bold text-foreground">Total: {formatCurrency(order.totalAmount)}</span>
                    <Link href={`/orders/${order.id}`}>
                      <Button size="sm" variant="ghost" className="text-xs rounded-xl">
                        View Receipt
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Address Book & Wishlist */}
        <div className="space-y-6">
          {/* Saved Addresses */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Saved Addresses
            </h2>

            {user.addresses.map((addr: any) => (
              <Card key={addr.id} className="glass-card p-4 rounded-2xl border space-y-1 text-xs">
                <p className="font-bold text-foreground">{addr.fullName}</p>
                <p className="text-muted-foreground">{addr.street}, {addr.city}</p>
                <p className="text-muted-foreground">{addr.state} - {addr.pincode}</p>
              </Card>
            ))}
          </div>

          {/* Wishlist */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Wishlist ({wishlistItems.length})
            </h2>

            {wishlistItems.map((item: any) => (
              <Card key={item.id} className="glass-card p-3 rounded-2xl border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted">
                    <img src={item.product.images[0]?.url} alt={item.product.name} className="object-cover w-full h-full" />
                  </div>
                  <span className="font-bold text-foreground line-clamp-1">{item.product.name}</span>
                </div>
                <Link href={`/products/${item.product.slug}`}>
                  <Button size="sm" variant="ghost" className="text-xs rounded-lg">View</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
