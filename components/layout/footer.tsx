"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { TreePine, Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 text-muted-foreground pt-16 pb-24 md:pb-12">
      {/* Value Proposition Badges */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">Temperature-Controlled Express</h4>
              <p className="text-xs text-muted-foreground">Cold-chain delivery for fresh produce & saplings.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">Certified Virus-Free Stocks</h4>
              <p className="text-xs text-muted-foreground">Dutch import lineage M9 T337 rootstocks.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">100% Growth Guarantee</h4>
              <p className="text-xs text-muted-foreground">Replacement backing on all nursery plants.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">Encrypted Razorpay Checkout</h4>
              <p className="text-xs text-muted-foreground">UPI, Cards, NetBanking & COD supported.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TreePine className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground font-serif">
              {siteConfig.name}
            </span>
          </Link>
          <p className="text-sm max-w-sm leading-relaxed">
            {siteConfig.description}
          </p>

          <div className="pt-2 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{siteConfig.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>{siteConfig.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>{siteConfig.supportEmail}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Columns */}
        {siteConfig.footerLinks.map((group) => (
          <div key={group.title} className="space-y-3">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider font-sans">
              {group.title}
            </h4>
            <ul className="space-y-2 text-sm">
              {group.items.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors block py-0.5"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 mt-16 pt-8 border-t">
        <div className="glass-panel rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-foreground font-serif">
              Join the Orchard Grower's Circle
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Receive seasonal pruning advisories, rootstock inventory alerts, and exclusive discounts.
            </p>
          </div>

          <form className="flex w-full lg:w-auto items-center gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="w-full lg:w-72"
            />
            <Button type="submit" variant="default" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </div>

        {/* Bottom Rights */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Orchard E-Commerce Platform. All rights reserved. BCA Final Project.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/faq" className="hover:underline">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
