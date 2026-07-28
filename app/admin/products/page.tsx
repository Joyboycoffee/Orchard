import { getProductsAction } from "@/actions/products";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminProductsPage() {
  const res = await getProductsAction({ limit: 50 });
  const prodData: any = res.data;
  const products: any[] = Array.isArray(prodData?.products) ? prodData.products : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif">Product Catalog & Nursery Stock</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage inventory levels, base prices, sale discounts, and high-density saplings.
          </p>
        </div>
        <Button size="sm" className="rounded-xl font-bold gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
      </div>

      <Card className="glass-card rounded-3xl p-6 border">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Base Price</th>
                <th className="p-3">Sale Price</th>
                <th className="p-3">Stock Quantity</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20">
                  <td className="p-3 font-bold text-foreground flex items-center gap-3">
                    <img src={p.images?.[0]?.url} alt={p.name} className="h-9 w-9 rounded-lg object-cover bg-muted" />
                    <span>{p.name}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.category?.name}</td>
                  <td className="p-3 font-mono">{p.sku}</td>
                  <td className="p-3">{formatCurrency(p.basePrice)}</td>
                  <td className="p-3 font-bold text-primary">{p.salePrice ? formatCurrency(p.salePrice) : "-"}</td>
                  <td className="p-3">
                    <Badge variant={p.stockQuantity > 20 ? "success" : "destructive"}>
                      {p.stockQuantity} units
                    </Badge>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
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
