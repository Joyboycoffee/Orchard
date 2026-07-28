import { PrismaClient, Role, CategoryType, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Orchard database seeding...");

  // 1. Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.blogPost.deleteMany();

  // 2. Create Users
  const passwordHash = await bcrypt.hash("AdminPassword123!", 10);
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@orchard.com",
      passwordHash,
      fullName: "Super Admin",
      phone: "+919876543210",
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@orchard.com",
      passwordHash,
      fullName: "Orchard Admin",
      phone: "+919876543211",
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@orchard.com",
      passwordHash: customerPasswordHash,
      fullName: "Aarav Sharma",
      phone: "+919876543212",
      role: Role.CUSTOMER,
      isEmailVerified: true,
      addresses: {
        create: {
          fullName: "Aarav Sharma",
          phone: "+919876543212",
          street: "12 Pine View Colony, Mall Road",
          city: "Manali",
          state: "Himachal Pradesh",
          pincode: "175131",
          country: "India",
          isDefault: true,
        },
      },
    },
  });

  console.log("✅ Created default users");

  // 3. Create Categories & Subcategories
  const freshApplesCat = await prisma.category.create({
    data: {
      name: "Fresh Apples",
      slug: "fresh-apples",
      type: CategoryType.FRESH_APPLES,
      description: "Crisp, organic, high-altitude handpicked apples from Kullu Valley.",
      imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
      subcategories: {
        create: [
          { name: "Honeycrisp", slug: "honeycrisp", description: "Ultra-crisp, sweet & tart balance." },
          { name: "Fuji Supreme", slug: "fuji", description: "Dense, juicy with honey sweetness." },
          { name: "Gala Royal", slug: "gala", description: "Crisp, floral aroma, thin skin." },
          { name: "Pink Lady", slug: "pink-lady", description: "Crisp crunch with effervescent flavor." },
        ],
      },
    },
  });

  const appleTreesCat = await prisma.category.create({
    data: {
      name: "Apple Trees",
      slug: "apple-trees",
      type: CategoryType.APPLE_TREES,
      description: "Grafted feathered saplings for commercial and home orchards.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      subcategories: {
        create: [
          { name: "High-Density Feathered", slug: "feathered", description: "Premature branches ready for high-density production." },
          { name: "Spur Type Trees", slug: "spur", description: "Compact growth with high yield per acre." },
          { name: "Pollinators", slug: "pollinators", description: "Essential crabapple & pollinator saplings." },
        ],
      },
    },
  });

  const rootstocksCat = await prisma.category.create({
    data: {
      name: "Rootstocks",
      slug: "rootstocks",
      type: CategoryType.ROOTSTOCKS,
      description: "Certified virus-indexed clonal rootstocks (M9, Geneva, MM106).",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
      subcategories: {
        create: [
          { name: "M9 T337 Dwarf", slug: "m9-t337", description: "Industry standard dwarfing clonal rootstock." },
          { name: "Geneva G11 / G41", slug: "geneva", description: "Fire blight and replant disease resistant." },
          { name: "MM106 Semi-Dwarf", slug: "mm106", description: "Strong root system for un-irrigated soils." },
        ],
      },
    },
  });

  const accessoriesCat = await prisma.category.create({
    data: {
      name: "Gardening & Nursery Accessories",
      slug: "gardening-accessories",
      type: CategoryType.GARDENING_ACCESSORIES,
      description: "Professional pruning shears, grafting wax, trellis wire, and bio-nutrients.",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
      subcategories: {
        create: [
          { name: "Pruning Tools", slug: "pruning", description: "Japanese carbon steel secateurs & loppers." },
          { name: "Grafting Materials", slug: "grafting", description: "Parafilm, grafting tape, and sealing wax." },
          { name: "Trellis & Supports", slug: "trellis", description: "Galvanized wire, bamboo poles, rubber ties." },
        ],
      },
    },
  });

  console.log("✅ Created categories & subcategories");

  // 4. Create Products
  // Fresh Apple Product
  const honeycrispApple = await prisma.product.create({
    data: {
      name: "Kullu Royal Honeycrisp Apples",
      slug: "kullu-royal-honeycrisp-apples",
      sku: "APP-HC-001",
      shortDescription: "Ultra-crisp high-altitude Honeycrisp apples harvested at peak ripeness.",
      description: "Harvested at 7,500 ft elevation in Kullu Valley, our Royal Honeycrisp apples boast a legendary snap, exploding juice cells, and a balanced sweet-tart profile. Grown organically without artificial waxes.",
      categoryId: freshApplesCat.id,
      basePrice: 499,
      salePrice: 399,
      costPrice: 200,
      variety: "Honeycrisp",
      harvestSeason: "Late August",
      fruitSize: "Large (80mm+)",
      stockQuantity: 150,
      isFeatured: true,
      isBestSeller: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
            altText: "Kullu Royal Honeycrisp Apples Basket",
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          { name: "3 kg Box", sku: "APP-HC-3KG", price: 499, salePrice: 399, stock: 100, attributes: { weight: "3kg" } },
          { name: "5 kg Gift Crate", sku: "APP-HC-5KG", price: 899, salePrice: 749, stock: 50, attributes: { weight: "5kg" } },
        ],
      },
    },
  });

  // Apple Tree Sapling
  const galaTree = await prisma.product.create({
    data: {
      name: "Buckeye Gala Feathered Sapling (M9 T337)",
      slug: "buckeye-gala-feathered-sapling-m9",
      sku: "TREE-GL-M9",
      shortDescription: "2-Year Knip-boom feathered apple tree grafted on M9 T337 rootstock.",
      description: "Commercial quality 2-year old feathered apple plant (Knip-boom) with 5+ side branches. Pre-conditioned for early cropping in high-density orchards (1,200 to 1,500 trees/acre). Certified virus-indexed stock.",
      categoryId: appleTreesCat.id,
      basePrice: 450,
      salePrice: 380,
      costPrice: 180,
      variety: "Buckeye Gala",
      chillingHours: 750,
      rootstockType: "M9 T337",
      treeHeight: "5 - 6 feet",
      diseaseResistance: "Powdery Mildew Tolerant",
      stockQuantity: 500,
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            altText: "Gala Apple Sapling Nursery Field",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Rootstock Product
  const m9Rootstock = await prisma.product.create({
    data: {
      name: "M9 T337 Clonal Rootstock (Bundle of 10)",
      slug: "m9-t337-clonal-rootstock-bundle-10",
      sku: "RS-M9T337-10P",
      shortDescription: "Grade-1 (8-10mm) virus-free Dutch clonal M9 rootstock liners for bench grafting.",
      description: "Imported Dutch lineage M9 T337 dwarfing rootstock liners. Features dense fibrous root structure, superior graft compatibility, and precocious fruiting triggers. Ideal for bench grafting in winter.",
      categoryId: rootstocksCat.id,
      basePrice: 1200,
      salePrice: 999,
      costPrice: 500,
      variety: "M9 T337",
      rootstockType: "M9 T337 Dwarf",
      diseaseResistance: "Crown Rot Resistant",
      stockQuantity: 300,
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
            altText: "M9 Clonal Rootstock Bundle",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Gardening Accessory
  const secateur = await prisma.product.create({
    data: {
      name: "Pro-Pruner Japanese Carbon Steel Bypass Secateurs",
      slug: "pro-pruner-japanese-steel-secateurs",
      sku: "ACC-PRUNER-JP",
      shortDescription: "Precision forged SK5 high-carbon Japanese steel orchard pruning shears.",
      description: "Engineered for high-volume orchard pruning. Razor-sharp SK5 carbon steel blades make effortless clean cuts up to 25mm diameter. Ergonomic non-slip aluminum alloy handles reduce hand fatigue.",
      categoryId: accessoriesCat.id,
      basePrice: 1899,
      salePrice: 1499,
      costPrice: 700,
      stockQuantity: 80,
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
            altText: "Japanese Steel Pruning Shears",
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log("✅ Created products and images");

  // 5. Create Reviews
  await prisma.review.create({
    data: {
      productId: honeycrispApple.id,
      userId: customer.id,
      rating: 5,
      title: "Extremely crisp & juicy!",
      comment: "The apples arrived in perfect molded pulp packaging. Not a single bruise! Sweetness and crunch are 10/10.",
      isVerifiedPurchase: true,
    },
  });

  await prisma.review.create({
    data: {
      productId: galaTree.id,
      userId: customer.id,
      rating: 5,
      title: "Healthy root system on saplings",
      comment: "Received 50 feathered Gala saplings. Excellent graft union and thick root flare. All sprouted leaves within 2 weeks of planting.",
      isVerifiedPurchase: true,
    },
  });

  // 6. Create Coupons
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      type: CouponType.PERCENTAGE,
      discountValue: 10,
      minOrderAmount: 999,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  });

  await prisma.coupon.create({
    data: {
      code: "ORCHARD200",
      type: CouponType.FIXED_AMOUNT,
      discountValue: 200,
      minOrderAmount: 1999,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  // 7. Create Banners
  await prisma.banner.create({
    data: {
      title: "High-Density Apple Nursery 2026",
      subtitle: "Certified Feathered Trees & Virus-Free Dutch M9 Rootstocks",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      linkUrl: "/category/apple-trees",
      buttonText: "Explore Nursery",
      sortOrder: 1,
    },
  });

  // 8. Create Blog Posts
  await prisma.blogPost.create({
    data: {
      title: "Complete Guide to M9 T337 Rootstock Canopy Management",
      slug: "complete-guide-m9-t337-rootstock-canopy-management",
      excerpt: "Learn how to train tall spindle apple trees for max yields of 30+ tonnes per acre.",
      content: "High-density apple orchards using M9 T337 rootstocks require precise tall-spindle canopy architecture. By maintaining a single central leader and selecting weak lateral branches, growers achieve early bearing in Year 2...",
      category: "Rootstock Library",
      authorId: admin.id,
      coverImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
    },
  });

  console.log("🌱 Database seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
