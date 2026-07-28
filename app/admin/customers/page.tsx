import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, MapPin } from "lucide-react";

export default function AdminCustomersPage() {
  const customers = [
    { id: "1", name: "Aarav Sharma", email: "customer@orchard.com", phone: "+919876543212", location: "Manali, HP", orders: 3, role: "CUSTOMER" },
    { id: "2", name: "Rajesh Thakur", email: "rajesh.orchards@gmail.com", phone: "+919812345678", location: "Kullu, HP", orders: 12, role: "COMMERCIAL_GROWER" },
    { id: "3", name: "Sanjay Mehta", email: "sanjay@himachalapples.in", phone: "+919876501234", location: "Shimla, HP", orders: 8, role: "COMMERCIAL_GROWER" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif">Customer & Grower CRM</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Directory of registered commercial growers, retail buyers, and account roles.
        </p>
      </div>

      <Card className="glass-card rounded-3xl p-6 border">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Location</th>
                <th className="p-3">Total Orders</th>
                <th className="p-3">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="p-3 font-bold text-foreground">{c.name}</td>
                  <td className="p-3 text-muted-foreground">{c.email}</td>
                  <td className="p-3 font-mono">{c.phone}</td>
                  <td className="p-3">{c.location}</td>
                  <td className="p-3 font-bold">{c.orders} orders</td>
                  <td className="p-3">
                    <Badge variant="outline">{c.role}</Badge>
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
