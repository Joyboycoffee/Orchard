import { getFullDbUser } from "@/lib/auth";
import { getCartAction } from "@/actions/cart";
import { redirect } from "next/navigation";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const user = await getFullDbUser();
  if (!user) redirect("/login?callbackUrl=/checkout");

  const cartRes = await getCartAction();
  const cartData: any = cartRes.data;

  if (!cartRes.success || !cartData || !cartData.items || cartData.items.length === 0) {
    redirect("/cart");
  }

  const { items, subtotal } = cartData;

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-bold font-serif">Checkout</h1>
      <CheckoutForm user={user} items={items} subtotal={subtotal} />
    </div>
  );
}
