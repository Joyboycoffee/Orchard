import { PrismaClient, Role, CategoryType, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Orchard database seeding with distinct high-res product catalog...");

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
      imageUrl: "https://images.unsplash.com/photo-1585336261026-9136355506c7?auto=format&fit=crop&w=800&q=80",
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

  // 4. Create 14 Distinct Products with Unique Images
  // Product 1: Honeycrisp Apple
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
            altText: "Kullu Royal Honeycrisp Apples Crate",
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80",
            altText: "Fresh Sliced Honeycrisp Apple",
            isPrimary: false,
          },
        ],
      },
    },
  });

  // Product 2: Fuji Apple
  const fujiApple = await prisma.product.create({
    data: {
      name: "Himalayan Fuji Supreme Apples",
      slug: "himalayan-fuji-supreme-apples",
      sku: "APP-FJ-002",
      shortDescription: "Sweet, dense & long-storing high-altitude Fuji apples.",
      description: "Known for their intense honey sweetness and dense crunch, these Fuji apples stay fresh for months. Hand-sorted for premium coloration and zero internal watercore.",
      categoryId: freshApplesCat.id,
      basePrice: 549,
      salePrice: 449,
      costPrice: 220,
      variety: "Fuji Supreme",
      harvestSeason: "Late October",
      fruitSize: "Extra Large (85mm)",
      stockQuantity: 120,
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80",
            altText: "Himalayan Fuji Supreme Apple on Branch",
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1579613832111-ac7dfcc7723f?auto=format&fit=crop&w=800&q=80",
            altText: "Ripe Fuji Apple Close-up",
            isPrimary: false,
          },
        ],
      },
    },
  });

  // Product 3: Gala Apple
  const galaApple = await prisma.product.create({
    data: {
      name: "Organic Royal Gala Crimson Apples",
      slug: "organic-royal-gala-crimson-apples",
      sku: "APP-GL-003",
      shortDescription: "Aromatic, thin-skinned crimson striped Gala apples.",
      description: "Crisp and aromatic with a delicate floral fragrance. Perfect for fresh snacking, salads, or school lunchboxes. 100% pesticide-residue free.",
      categoryId: freshApplesCat.id,
      basePrice: 429,
      salePrice: 349,
      costPrice: 180,
      variety: "Royal Gala",
      harvestSeason: "Early August",
      fruitSize: "Medium (75mm)",
      stockQuantity: 200,
      isFeatured: false,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=800&q=80",
            altText: "Royal Gala Crimson Apples",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 4: Pink Lady Apple
  const pinkLadyApple = await prisma.product.create({
    data: {
      name: "High-Altitude Pink Lady Apples",
      slug: "high-altitude-pink-lady-apples",
      sku: "APP-PL-004",
      shortDescription: "Tangy-sweet fizzy crunch with a distinct pink blush.",
      description: "The last variety harvested in Kullu Valley, allowing 200+ days of sunshine to build unmatched sugars and vibrant pink coloration.",
      categoryId: freshApplesCat.id,
      basePrice: 599,
      salePrice: 489,
      costPrice: 250,
      variety: "Pink Lady",
      harvestSeason: "November",
      fruitSize: "Large (80mm)",
      stockQuantity: 90,
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?auto=format&fit=crop&w=800&q=80",
            altText: "High Altitude Pink Lady Apples",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 5: Buckeye Gala Sapling
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

  // Product 6: Jeromine Red Delicious Spur Tree
  const jeromineTree = await prisma.product.create({
    data: {
      name: "Jeromine Red Delicious Spur Sapling (MM106)",
      slug: "jeromine-red-delicious-spur-sapling-mm106",
      sku: "TREE-JR-MM106",
      shortDescription: "Deep solid-red spur variety with compact branch structure.",
      description: "Jeromine produces 100% full dark crimson fruit even on interior spurs. Grafted on semi-dwarfing MM106 rootstocks suitable for un-irrigated mountain terrain.",
      categoryId: appleTreesCat.id,
      basePrice: 480,
      salePrice: 399,
      costPrice: 190,
      variety: "Jeromine",
      chillingHours: 850,
      rootstockType: "MM106",
      treeHeight: "6 - 7 feet",
      diseaseResistance: "Scab Resistant",
      stockQuantity: 350,
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&w=800&q=80",
            altText: "Jeromine Red Delicious Sapling",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 7: Golden Delicious Pollinator Tree
  const pollinatorTree = await prisma.product.create({
    data: {
      name: "Golden Delicious Pollinator Container Tree",
      slug: "golden-delicious-pollinator-container-tree",
      sku: "TREE-GD-POL",
      shortDescription: "Essential universal pollinator tree with abundant bloom period.",
      description: "Vital for commercial orchard set. Overlaps with Gala, Honeycrisp, and Red Delicious bloom periods. Container-grown for year-round planting.",
      categoryId: appleTreesCat.id,
      basePrice: 520,
      salePrice: 425,
      costPrice: 210,
      variety: "Golden Delicious",
      chillingHours: 700,
      rootstockType: "Geneva G11",
      treeHeight: "4 - 5 feet",
      diseaseResistance: "Fire Blight Immune",
      stockQuantity: 180,
      isFeatured: false,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
            altText: "Golden Delicious Pollinator Sapling",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 8: M9 T337 Rootstock
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

  // Product 9: Geneva G11 Rootstock
  const genevaRootstock = await prisma.product.create({
    data: {
      name: "Geneva G11 Resistant Rootstock (Bundle of 10)",
      slug: "geneva-g11-resistant-rootstock-bundle-10",
      sku: "RS-G11-10P",
      shortDescription: "Cornell University bred fire blight & woolly aphid immune rootstock.",
      description: "Developed at Cornell Geneva station, G11 offers dwarf vigor similar to M9 but eliminates tree mortality from fire blight and replant disease. Excellent winter hardiness.",
      categoryId: rootstocksCat.id,
      basePrice: 1450,
      salePrice: 1199,
      costPrice: 650,
      variety: "Geneva G11",
      rootstockType: "Geneva G11 Dwarf",
      diseaseResistance: "Fire Blight & Woolly Aphid Immune",
      stockQuantity: 250,
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
            altText: "Geneva G11 Clonal Rootstock",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 10: MM106 Rootstock
  const mm106Rootstock = await prisma.product.create({
    data: {
      name: "MM106 Semi-Dwarf Rootstock (Bundle of 10)",
      slug: "mm106-semi-dwarf-rootstock-bundle-10",
      sku: "RS-MM106-10P",
      shortDescription: "Anchor-strong semi-dwarf rootstock for slope and non-irrigated soils.",
      description: "Produces medium-sized trees requiring minimal staking support. Deep taproot system withstands drought and gravelly hill soils.",
      categoryId: rootstocksCat.id,
      basePrice: 1100,
      salePrice: 899,
      costPrice: 450,
      variety: "MM106",
      rootstockType: "MM106 Semi-Dwarf",
      diseaseResistance: "Woolly Apple Aphid Resistant",
      stockQuantity: 400,
      isFeatured: false,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
            altText: "MM106 Rootstock Liners",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 11: Japanese Secateurs
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
            url: "https://images.unsplash.com/photo-1585336261026-9136355506c7?auto=format&fit=crop&w=800&q=80",
            altText: "Japanese Steel Pruning Shears",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 12: Grafting Tape
  const graftingTape = await prisma.product.create({
    data: {
      name: "Professional Parafilm Grafting Tape & Sealing Wax Kit",
      slug: "professional-parafilm-grafting-tape-kit",
      sku: "ACC-GRAFT-KIT",
      shortDescription: "Self-sealing stretchable moisture barrier tape for 98% graft success.",
      description: "Includes 2 rolls of genuine Parafilm M grafting tape (width 29mm) and 500g organic beeswax sealing ointment. Prevents graft moisture loss while expanding naturally as scions grow.",
      categoryId: accessoriesCat.id,
      basePrice: 799,
      salePrice: 599,
      costPrice: 250,
      stockQuantity: 150,
      isFeatured: false,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
            altText: "Parafilm Grafting Tape Kit",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 13: Trellis Wire
  const trellisWire = await prisma.product.create({
    data: {
      name: "Galvanized High-Tensile Trellis Wire (500m Roll)",
      slug: "galvanized-high-tensile-trellis-wire-500m",
      sku: "ACC-TRELLIS-500M",
      shortDescription: "Heavy gauge class-3 galvanized wire for tall spindle support systems.",
      description: "Rust-proof 2.5mm high-tensile steel wire designed to support heavy crop loads on M9 high-density trellises. Rated for 15+ years outdoor mountain exposure.",
      categoryId: accessoriesCat.id,
      basePrice: 3499,
      salePrice: 2899,
      costPrice: 1500,
      stockQuantity: 60,
      isFeatured: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
            altText: "Galvanized Trellis Wire Roll",
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log("✅ Created 13 distinct products with unique images");

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

  console.log("🌱 Database seeding finished successfully with 13 unique products!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
