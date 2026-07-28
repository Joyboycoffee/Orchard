export interface NavItem {
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export const siteConfig = {
  name: "Orchard",
  shortName: "Orchard",
  description:
    "A premium e-commerce platform for high-density fresh apples, certified fruit trees, clonal rootstocks, and professional orchard supplies.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://orchard-store.com",
  ogImage: "/og.jpg",
  supportEmail: "support@orchard-store.com",
  phone: "+91 (800) 555-ORCHARD",
  address: "Orchard Estate, Kullu Valley, Himachal Pradesh - 175101, India",
  currency: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
  },
  socials: {
    instagram: "https://instagram.com/orchard_official",
    twitter: "https://twitter.com/orchard_store",
    facebook: "https://facebook.com/orchardstore",
    youtube: "https://youtube.com/c/orchardguide",
  },
  mainNav: [
    {
      title: "Fresh Produce",
      href: "/category/fresh-apples",
      description: "Hand-picked, premium high-altitude crisp apples.",
      children: [
        { title: "Honeycrisp", href: "/products?category=fresh-apples&sub=honeycrisp" },
        { title: "Fuji Supreme", href: "/products?category=fresh-apples&sub=fuji" },
        { title: "Gala Royal", href: "/products?category=fresh-apples&sub=gala" },
        { title: "Pink Lady", href: "/products?category=fresh-apples&sub=pink-lady" },
        { title: "Organic Baskets", href: "/products?category=fresh-apples&sub=organic" },
      ],
    },
    {
      title: "Apple Trees",
      href: "/category/apple-trees",
      description: "Feathered plants for high-density & traditional farming.",
      children: [
        { title: "High-Density Feathered Trees", href: "/products?category=apple-trees&sub=feathered" },
        { title: "Spur Type Trees", href: "/products?category=apple-trees&sub=spur" },
        { title: "Pollinator Varieties", href: "/products?category=apple-trees&sub=pollinators" },
        { title: "Container Plant Trees", href: "/products?category=apple-trees&sub=container" },
      ],
    },
    {
      title: "Rootstocks",
      href: "/category/rootstocks",
      description: "Virus-indexed clonal rootstocks (M9, MM106, Geneva series).",
      children: [
        { title: "M9 T337 Dwarf Rootstock", href: "/products?category=rootstocks&sub=m9-t337" },
        { title: "Geneva G11 / G41 Resistant", href: "/products?category=rootstocks&sub=geneva" },
        { title: "MM106 Semi-Dwarf Rootstock", href: "/products?category=rootstocks&sub=mm106" },
        { title: "M26 Clonal Rootstock", href: "/products?category=rootstocks&sub=m26" },
      ],
    },
    {
      title: "Gardening & Nursery",
      href: "/category/gardening-accessories",
      description: "Trellis wire, grafting wax, secateurs, and soil enhancers.",
      children: [
        { title: "Pruning Tools & Secateurs", href: "/products?category=gardening-accessories&sub=pruning" },
        { title: "Grafting Tape & Wax", href: "/products?category=gardening-accessories&sub=grafting" },
        { title: "Trellis Support Systems", href: "/products?category=gardening-accessories&sub=trellis" },
        { title: "Organic Fertilizers & Fungicides", href: "/products?category=gardening-accessories&sub=fertilizers" },
      ],
    },
    {
      title: "Knowledge Hub",
      href: "/rootstock-library",
      description: "Expert guides on rootstock selection, canopy training, and soil care.",
      children: [
        { title: "Rootstock Library", href: "/rootstock-library" },
        { title: "Tree Selector Guide", href: "/tree-guide" },
        { title: "Seasonal Plant Care", href: "/plant-care" },
        { title: "Community Forum", href: "/community" },
        { title: "Orchard Blogs", href: "/blogs" },
      ],
    },
  ] as NavItem[],
  footerLinks: [
    {
      title: "Shop & Categories",
      items: [
        { title: "Fresh Apples", href: "/category/fresh-apples" },
        { title: "Apple Trees", href: "/category/apple-trees" },
        { title: "Clonal Rootstocks", href: "/category/rootstocks" },
        { title: "Gardening Accessories", href: "/category/gardening-accessories" },
        { title: "Special Bundles & Offers", href: "/offers" },
      ],
    },
    {
      title: "Learning & Guides",
      items: [
        { title: "Rootstock Library", href: "/rootstock-library" },
        { title: "Apple Tree Selection", href: "/tree-guide" },
        { title: "Plant Care Calendar", href: "/plant-care" },
        { title: "Blog Articles", href: "/blogs" },
        { title: "Community Forum", href: "/community" },
      ],
    },
    {
      title: "Customer Support",
      items: [
        { title: "Contact Us", href: "/contact" },
        { title: "Track Order", href: "/order-tracking" },
        { title: "Shipping & Delivery", href: "/shipping-policy" },
        { title: "Returns & Refund Policy", href: "/returns" },
        { title: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Legal & Corporate",
      items: [
        { title: "About Orchard", href: "/about" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
        { title: "Certifications & Accreditation", href: "/certifications" },
      ],
    },
  ],
};
