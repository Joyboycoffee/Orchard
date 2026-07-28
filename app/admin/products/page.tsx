import { getProductsAction } from "@/actions/products";
import { ProductManagementTable } from "./product-management-table";

export default async function AdminProductsPage() {
  const res = await getProductsAction({ limit: 100 });
  const prodData: any = res.data;
  const products: any[] = Array.isArray(prodData?.products) ? prodData.products : [];

  return <ProductManagementTable initialProducts={products} />;
}
