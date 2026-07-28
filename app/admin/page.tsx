import { getAdminDashboardStatsAction } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { IndianRupee, ShoppingBag, Users, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const statsRes = await getAdminDashboardStatsAction();
  const stats: any = statsRes.data || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    recentOrders: [],
    orderStatusCounts: [],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time metrics on revenue, stock inventory, customer orders, and nursery fulfillment.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card rounded-3xl p-6 border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Verified Paid Transactions</p>
        </Card>

        <Card className="glass-card rounded-3xl p-6 border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Orders</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
          <p className="text-[11px] text-muted-foreground">Across all categories</p>
        </Card>

        <Card className="glass-card rounded-3xl p-6 border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Customers</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalCustomers}</p>
          <p className="text-[11px] text-muted-foreground">Registered commercial growers</p>
        </Card>

        <Card className="glass-card rounded-3xl p-6 border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Low Stock Warning</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.lowStockProducts}</p>
          <p className="text-[11px] text-amber-600 font-medium">Products with &lt; 10 units</p>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="glass-card rounded-3xl p-6 border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg font-serif">Recent Customer Orders</h3>
          <Link href="/admin/orders" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b bg-muted/30 text-muted-foreground">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="p-3 font-mono font-bold">{order.orderNumber}</td>
                  <td className="p-3">{order.user.fullName}</td>
                  <td className="p-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                  <td className="p-3 font-bold">{formatCurrency(order.totalAmount)}</td>
                  <td className="p-3">
                    <Badge variant={order.orderStatus === "DELIVERED" ? "success" : "outline"}>
                      {order.orderStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
