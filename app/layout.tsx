import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCurrentUser } from "@/lib/auth";
import { getCartAction } from "@/actions/cart";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name + " — High-Density Apple Nursery & Fresh Produce",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#05130b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  let cartCount = 0;

  if (user) {
    const cartRes = await getCartAction();
    const cartData: any = cartRes.data;
    if (cartRes.success && cartData) {
      cartCount = cartData.itemCount || 0;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider />
          <Navbar cartItemCount={cartCount} user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav cartItemCount={cartCount} />
        </ThemeProvider>
      </body>
    </html>
  );
}
