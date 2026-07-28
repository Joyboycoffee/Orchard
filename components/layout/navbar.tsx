"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  Sparkles,
  Command,
  Sun,
  Moon,
  TreePine,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  cartItemCount?: number;
  user?: { fullName: string; email: string; role: string } | null;
}

export function Navbar({ cartItemCount = 0, user }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        <span>Pre-Order 2026 Season Knip-Boom Apple Saplings & Dutch M9 Rootstocks — Free Delivery on Orders Over ₹1,999</span>
      </div>

      {/* Main Glass Header */}
      <nav className="glass-navbar border-b px-4 lg:px-8 py-3.5 transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              <TreePine className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground font-serif">
                {siteConfig.name}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                Premium Nursery & Produce
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {siteConfig.mainNav.map((item) => (
              <div key={item.title} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  {item.title}
                </Link>

                {item.children && (
                  <div className="absolute top-full left-0 hidden group-hover:block pt-2 w-64 z-50">
                    <div className="glass-card rounded-2xl p-3 shadow-2xl border bg-background/95 backdrop-blur-xl">
                      <p className="text-xs font-semibold text-muted-foreground px-3 py-1 uppercase tracking-wider">
                        {item.description}
                      </p>
                      <div className="mt-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <Link href="/products">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Search className="h-5 w-5 text-foreground" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
              <span className="sr-only">Toggle Theme</span>
            </Button>

            {/* Wishlist Icon */}
            <Link href="/dashboard?tab=wishlist" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Heart className="h-5 w-5 text-foreground" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative rounded-xl gap-2 font-semibold">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <Badge variant="default" className="h-5 px-1.5 rounded-full text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account / Auth */}
            {user ? (
              <Link href={user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"} className="shrink-0">
                <Button variant="default" size="sm" className="rounded-xl gap-1.5 font-semibold bg-gradient-to-r from-emerald-600 to-primary px-2.5 sm:px-4">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate max-w-[80px] sm:max-w-none">{user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "Admin" : user.fullName.split(" ")[0]}</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="rounded-xl">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t space-y-3 px-2">
            {siteConfig.mainNav.map((item) => (
              <div key={item.title} className="space-y-1">
                <Link
                  href={item.href}
                  className="block font-semibold text-foreground py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1 border-l-2 border-primary/20">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className="block text-sm text-muted-foreground hover:text-primary py-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
