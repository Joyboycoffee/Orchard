import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileHeader } from "@/components/admin/admin-mobile-header";
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
    <div className="flex flex-col md:flex-row min-h-screen bg-background max-w-full overflow-x-hidden">
      <AdminMobileHeader />
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
