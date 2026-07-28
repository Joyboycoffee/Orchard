"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { createProductAction, updateProductAction, deleteProductAction } from "@/actions/products";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Check } from "lucide-react";

interface ProductManagementTableProps {
  initialProducts: any[];
}

export function ProductManagementTable({ initialProducts }: ProductManagementTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>(initialProducts);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    categorySlug: "fresh-apples",
    sku: "",
    basePrice: "",
    salePrice: "",
    stockQuantity: "",
    imageUrl: "",
    shortDescription: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      categorySlug: "fresh-apples",
      sku: "",
      basePrice: "",
      salePrice: "",
      stockQuantity: "",
      imageUrl: "",
      shortDescription: "",
    });
    setEditingProduct(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      categorySlug: p.category?.slug || "fresh-apples",
      sku: p.sku || "",
      basePrice: String(p.basePrice),
      salePrice: p.salePrice ? String(p.salePrice) : "",
      stockQuantity: String(p.stockQuantity),
      imageUrl: p.images?.[0]?.url || "",
      shortDescription: p.shortDescription || "",
    });
  };

  // Create Product Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createProductAction({
        name: formData.name,
        categorySlug: formData.categorySlug,
        sku: formData.sku,
        basePrice: Number(formData.basePrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stockQuantity: Number(formData.stockQuantity),
        imageUrl: formData.imageUrl,
        shortDescription: formData.shortDescription,
        description: formData.shortDescription,
      });

      if (res.success) {
        toast.success("Product created successfully!");
        setIsAddModalOpen(false);
        resetForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create product");
      }
    } catch {
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  // Edit Product Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setLoading(true);
    try {
      const res = await updateProductAction(editingProduct.id, {
        name: formData.name,
        basePrice: Number(formData.basePrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stockQuantity: Number(formData.stockQuantity),
        imageUrl: formData.imageUrl,
        shortDescription: formData.shortDescription,
      });

      if (res.success) {
        toast.success("Product updated successfully!");
        setEditingProduct(null);
        resetForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update product");
      }
    } catch {
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await deleteProductAction(productId);
      if (res.success) {
        toast.success("Product deleted successfully");
        setProducts(products.filter((p) => p.id !== productId));
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete product");
      }
    } catch {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Add Product button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif">Product Catalog & Nursery Stock</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage inventory levels, base prices, sale discounts, and high-density saplings.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-xl font-bold gap-2 self-start sm:self-auto shadow-lg shadow-primary/20"
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
      </div>

      {/* Table Card */}
      <Card className="glass-card rounded-3xl p-6 border">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="p-3">Product Name & Image</th>
                <th className="p-3">Category</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Base Price</th>
                <th className="p-3">Sale Price</th>
                <th className="p-3">Stock Quantity</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => {
                const primaryImage =
                  p.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80";

                return (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="p-3 font-bold text-foreground flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-muted border">
                        <img src={primaryImage} alt={p.name} className="object-cover w-full h-full" />
                      </div>
                      <span className="line-clamp-1 max-w-xs">{p.name}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{p.category?.name || "General"}</td>
                    <td className="p-3 font-mono text-muted-foreground">{p.sku}</td>
                    <td className="p-3 font-semibold">{formatCurrency(p.basePrice)}</td>
                    <td className="p-3 font-bold text-primary">
                      {p.salePrice ? formatCurrency(p.salePrice) : "-"}
                    </td>
                    <td className="p-3">
                      <Badge variant={p.stockQuantity > 20 ? "success" : "destructive"}>
                        {p.stockQuantity} units
                      </Badge>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
                        onClick={() => handleOpenEdit(p)}
                        title="Edit Product Details & Image"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(p.id)}
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <Card className="glass-card rounded-3xl p-6 lg:p-8 border w-full max-w-lg space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Add New Product
              </h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Product Name</label>
                <Input
                  required
                  placeholder="e.g. Royal Honeycrisp Apples"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Category</label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border bg-background text-xs font-semibold"
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                  >
                    <option value="fresh-apples">Fresh Apples</option>
                    <option value="apple-trees">Apple Trees</option>
                    <option value="rootstocks">Rootstocks</option>
                    <option value="gardening-accessories">Gardening Accessories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">SKU Code</label>
                  <Input
                    placeholder="e.g. APP-HC-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Base Price (₹)</label>
                  <Input
                    type="number"
                    required
                    placeholder="499"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Sale Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="399"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="rounded-xl text-xs font-bold text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Stock Qty</label>
                  <Input
                    type="number"
                    required
                    placeholder="100"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Image URL</label>
                <Input
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Short Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Crisp high-altitude Kullu apples..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full rounded-xl border bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <Button type="submit" size="lg" className="w-full rounded-2xl font-bold gap-2 mt-2" isLoading={loading}>
                <Check className="h-4 w-4" /> Save & Publish Product
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <Card className="glass-card rounded-3xl p-6 lg:p-8 border w-full max-w-lg space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-primary" /> Edit Product Details & Image
              </h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setEditingProduct(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Product Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Base Price (₹)</label>
                  <Input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Sale Price (₹)</label>
                  <Input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="rounded-xl text-xs font-bold text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Stock Qty</label>
                  <Input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" /> Product Image URL
                </label>
                <Input
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="rounded-xl text-xs font-mono"
                />
                {formData.imageUrl && (
                  <div className="h-20 w-20 rounded-xl overflow-hidden border mt-2 bg-muted">
                    <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full rounded-xl border bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <Button type="submit" size="lg" className="w-full rounded-2xl font-bold gap-2 mt-2" isLoading={loading}>
                <Check className="h-4 w-4" /> Save Changes
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
