import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
