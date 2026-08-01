import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.giftCardOrder.deleteMany();
  await prisma.giftCardDenomination.deleteMany();
  await prisma.giftCardBrand.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.trackedProduct.deleteMany();
  await prisma.priceSnapshot.deleteMany();
  await prisma.storeListing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Demo User
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@pricehatke.com',
      name: 'Demo Shopper',
      passwordHash: '$2b$12$KIXp4B1lJ0x8o0R0kY5Z.O8gX7E0M3s.z6g3H2x1W8y9Z0A1B2C3D', // 'password123'
      provider: 'credentials',
      referralCode: 'HATKE100',
    },
  });
  console.log(`👤 Seeded User: ${demoUser.email}`);

  // 2. Seed Products (10 items)
  const productsData = [
    {
      canonicalTitle: 'Apple iPhone 15 (128 GB) - Blue',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB)',
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'Apple MacBook Air M3 Chip (13.6 inch, 8GB, 256GB SSD) - Starlight',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium Case',
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'Nike Air Jordan 1 Retro High OG Chicago Sneakers',
      category: 'Footwear',
      imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'PlayStation 5 Console (Slim Disc Edition)',
      category: 'Gaming',
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'Dyson V15 Detect Cordless Vacuum Cleaner',
      category: 'Appliances',
      imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'Levi’s Men’s 511 Slim Fit Jeans',
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-780c36856842?w=500&auto=format&fit=crop',
    },
    {
      canonicalTitle: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L',
      category: 'Home & Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=500&auto=format&fit=crop',
    },
  ];

  const products = [];
  for (const p of productsData) {
    const created = await prisma.product.create({ data: p });
    products.push(created);
  }
  console.log(`📦 Seeded ${products.length} Products`);

  // 3. Seed Store Listings (22 listings across stores)
  const stores = ['amazon', 'flipkart', 'myntra', 'croma', 'tatacliq'];
  const storeListings = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    // Create 2-3 store listings per product to allow cross-store comparison
    const productStores = [stores[0], stores[1]];
    if (i % 2 === 0) productStores.push(stores[2 + (i % 3)]);

    for (const store of productStores) {
      const listing = await prisma.storeListing.create({
        data: {
          productId: product.id,
          store,
          storeUrl: `https://${store}.com/item/${product.id.slice(0, 8)}`,
          storeProductId: `${store.toUpperCase()}-${i + 1}001`,
        },
      });
      storeListings.push(listing);
    }
  }
  console.log(`🏪 Seeded ${storeListings.length} Store Listings`);

  // 4. Seed Price Snapshots (250+ snapshots spread over 6 months)
  const now = Date.now();
  const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;
  let snapshotCount = 0;

  const basePrices: Record<number, { price: number; mrp: number }> = {
    0: { price: 69900, mrp: 79900 },  // iPhone 15
    1: { price: 129999, mrp: 139999 },// S24 Ultra
    2: { price: 99900, mrp: 114900 }, // MacBook Air M3
    3: { price: 26990, mrp: 34990 },  // Sony Headphones
    4: { price: 41900, mrp: 44900 },  // Apple Watch
    5: { price: 14995, mrp: 18995 },  // Air Jordan
    6: { price: 49990, mrp: 54990 },  // PS5
    7: { price: 62900, mrp: 69900 },  // Dyson V15
    8: { price: 2499, mrp: 4999 },    // Levi's Jeans
    9: { price: 8995, mrp: 12995 },   // Instant Pot
  };

  for (let i = 0; i < products.length; i++) {
    const productListings = storeListings.filter((l) => l.productId === products[i].id);
    const base = basePrices[i] || { price: 10000, mrp: 15000 };

    for (const listing of productListings) {
      // 12 price snapshots per listing over 180 days (every 15 days)
      const numSnapshots = 12;
      for (let s = numSnapshots; s >= 0; s--) {
        const daysAgo = s * 15;
        const capturedAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

        // Fluctuate price by ±15% with occasional sale drops
        const storeVariance = listing.store === 'amazon' ? 1.0 : listing.store === 'flipkart' ? 0.98 : 1.02;
        const wave = Math.sin(daysAgo / 30) * 0.08;
        const saleDrop = s === 3 || s === 8 ? -0.15 : 0; // Flash sales 45d and 120d ago
        const randomNoise = (Math.random() - 0.5) * 0.04;

        const currentPrice = Math.round(base.price * storeVariance * (1 + wave + saleDrop + randomNoise));

        await prisma.priceSnapshot.create({
          data: {
            storeListingId: listing.id,
            price: currentPrice,
            mrp: base.mrp,
            capturedAt,
          },
        });
        snapshotCount++;
      }
    }
  }
  console.log(`📈 Seeded ${snapshotCount} Price Snapshots`);

  // 5. Seed Deals (18 deals)
  const dealsData = [
    {
      title: 'Sony WH-1000XM5 ANC Headphones @ 35% Flat Off',
      store: 'amazon',
      storeUrl: 'https://amazon.in/dp/B0B3MWQX1Z',
      price: 22690,
      mrp: 34990,
      discountPct: 35,
      category: 'Audio',
      verified: true,
      popularityScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
    },
    {
      title: 'Samsung Galaxy S24 Ultra - Price Drop Alert!',
      store: 'flipkart',
      storeUrl: 'https://flipkart.com/samsung-s24-ultra',
      price: 109999,
      mrp: 139999,
      discountPct: 21,
      category: 'Electronics',
      verified: true,
      popularityScore: 95,
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop',
    },
    {
      title: 'Levi’s Flat 50% Off End of Season Sale',
      store: 'myntra',
      storeUrl: 'https://myntra.com/levis-sale',
      price: 2499,
      mrp: 4999,
      discountPct: 50,
      category: 'Fashion',
      verified: true,
      popularityScore: 89,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-780c36856842?w=500&auto=format&fit=crop',
    },
    {
      title: 'MacBook Air M3 Starlight Lowest Ever Price',
      store: 'amazon',
      storeUrl: 'https://amazon.in/dp/B0CX23V6X5',
      price: 89900,
      mrp: 114900,
      discountPct: 22,
      category: 'Laptops',
      verified: true,
      popularityScore: 99,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop',
    },
    {
      title: 'Nike Air Jordan 1 Chicago - 20% Off Limited Stock',
      store: 'ajio',
      storeUrl: 'https://ajio.com/nike-jordan-1',
      price: 11995,
      mrp: 14995,
      discountPct: 20,
      category: 'Footwear',
      verified: false,
      popularityScore: 84,
      imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop',
    },
    {
      title: 'Instant Pot Duo 6L @ 60% Off Flash Sale',
      store: 'amazon',
      storeUrl: 'https://amazon.in/dp/B00FLYWNYQ',
      price: 5198,
      mrp: 12995,
      discountPct: 60,
      category: 'Home & Kitchen',
      verified: true,
      popularityScore: 91,
      imageUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=500&auto=format&fit=crop',
    },
    {
      title: 'Apple Watch Series 9 GPS 45mm @ ₹36,990',
      store: 'croma',
      storeUrl: 'https://croma.com/apple-watch-s9',
      price: 36990,
      mrp: 44900,
      discountPct: 18,
      category: 'Wearables',
      verified: true,
      popularityScore: 88,
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop',
    },
    {
      title: 'PlayStation 5 Slim Console with Free Controller Bundle',
      store: 'tatacliq',
      storeUrl: 'https://tatacliq.com/ps5-slim',
      price: 44990,
      mrp: 54990,
      discountPct: 18,
      category: 'Gaming',
      verified: true,
      popularityScore: 96,
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop',
    },
    {
      title: 'Boat Airdopes 141 TWS Earbuds @ ₹999 (75% Off)',
      store: 'flipkart',
      storeUrl: 'https://flipkart.com/boat-airdopes',
      price: 999,
      mrp: 4490,
      discountPct: 77,
      category: 'Audio',
      verified: true,
      popularityScore: 97,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop',
    },
    {
      title: 'Puma Men Running Shoes @ Flat 55% Off',
      store: 'meesho',
      storeUrl: 'https://meesho.com/puma-running-shoes',
      price: 1799,
      mrp: 3999,
      discountPct: 55,
      category: 'Footwear',
      verified: false,
      popularityScore: 78,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop',
    },

    {
      title: 'Nykaa Beauty Luxe Lipstick Box - Min 40% Off',
      store: 'nykaa',
      storeUrl: 'https://nykaa.com/lipstick-box',
      price: 1199,
      mrp: 1999,
      discountPct: 40,
      category: 'Beauty',
      verified: true,
      popularityScore: 86,
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop',
    },

    {
      title: 'OnePlus 12 5G (16GB RAM, 512GB) Mega Drop',
      store: 'amazon',
      storeUrl: 'https://amazon.in/oneplus-12',
      price: 57999,
      mrp: 69999,
      discountPct: 17,
      category: 'Electronics',
      verified: true,
      popularityScore: 93,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop',
    },
    {
      title: 'Fastrack Smartwatch with Bluetooth Calling @ ₹1,499',
      store: 'flipkart',
      storeUrl: 'https://flipkart.com/fastrack-smartwatch',
      price: 1499,
      mrp: 4995,
      discountPct: 70,
      category: 'Wearables',
      verified: true,
      popularityScore: 92,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop',
    },
    {
      title: 'Philips Air Fryer HD9200 @ 45% Off',
      store: 'amazon',
      storeUrl: 'https://amazon.in/philips-air-fryer',
      price: 5499,
      mrp: 9995,
      discountPct: 45,
      category: 'Home & Kitchen',
      verified: true,
      popularityScore: 90,
      imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&auto=format&fit=crop',
    },

    {
      title: 'ASUS ROG Strix G16 Gaming Laptop - ₹20,000 Off',
      store: 'croma',
      storeUrl: 'https://croma.com/asus-rog-g16',
      price: 119990,
      mrp: 139990,
      discountPct: 14,
      category: 'Laptops',
      verified: true,
      popularityScore: 87,
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop',
    },
  ];

  for (const deal of dealsData) {
    await prisma.deal.create({ data: deal });
  }
  console.log(`🔥 Seeded ${dealsData.length} Deals`);

  // 6. Seed Gift Card Brands (6 brands) & Denominations (3 each)
  const giftCardBrands = [
    {
      name: 'Amazon Pay Gift Card',
      slug: 'amazon-pay-gift-card',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      denominations: [
        { faceValue: 500, sellPrice: 485, discountPct: 3 },
        { faceValue: 1000, sellPrice: 970, discountPct: 3 },
        { faceValue: 5000, sellPrice: 4800, discountPct: 4 },
      ],
    },
    {
      name: 'Flipkart E-Voucher',
      slug: 'flipkart-gift-card',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg',
      denominations: [
        { faceValue: 500, sellPrice: 475, discountPct: 5 },
        { faceValue: 2000, sellPrice: 1900, discountPct: 5 },
        { faceValue: 5000, sellPrice: 4700, discountPct: 6 },
      ],
    },
    {
      name: 'Myntra Shopping Voucher',
      slug: 'myntra-gift-card',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png',
      denominations: [
        { faceValue: 1000, sellPrice: 920, discountPct: 8 },
        { faceValue: 2500, sellPrice: 2275, discountPct: 9 },
        { faceValue: 5000, sellPrice: 4500, discountPct: 10 },
      ],
    },
    {
      name: 'Croma Electronics Card',
      slug: 'croma-gift-card',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Croma_logo.png',
      denominations: [
        { faceValue: 1000, sellPrice: 960, discountPct: 4 },
        { faceValue: 3000, sellPrice: 2850, discountPct: 5 },
        { faceValue: 10000, sellPrice: 9400, discountPct: 6 },
      ],
    },
    {
      name: 'Domino’s Pizza Voucher',
      slug: 'dominos-gift-card',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg',
      denominations: [
        { faceValue: 250, sellPrice: 212, discountPct: 15 },
        { faceValue: 500, sellPrice: 415, discountPct: 17 },
        { faceValue: 1000, sellPrice: 800, discountPct: 20 },
      ],
    },
    {
      name: 'Uber Ride Pass Card',
      slug: 'uber-gift-card',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
      denominations: [
        { faceValue: 250, sellPrice: 237, discountPct: 5 },
        { faceValue: 500, sellPrice: 465, discountPct: 7 },
        { faceValue: 1000, sellPrice: 920, discountPct: 8 },
      ],
    },
  ];

  let totalDenoms = 0;
  for (const b of giftCardBrands) {
    const brand = await prisma.giftCardBrand.create({
      data: {
        name: b.name,
        slug: b.slug,
        logoUrl: b.logoUrl,
      },
    });

    for (const d of b.denominations) {
      await prisma.giftCardDenomination.create({
        data: {
          brandId: brand.id,
          faceValue: d.faceValue,
          sellPrice: d.sellPrice,
          discountPct: d.discountPct,
        },
      });
      totalDenoms++;
    }
  }
  console.log(`🎁 Seeded ${giftCardBrands.length} Gift Card Brands (${totalDenoms} Denominations)`);

  // 7. Seed Sample Tracked Product & Alert for Demo User
  await prisma.trackedProduct.create({
    data: {
      userId: demoUser.id,
      productId: products[0].id,
    },
  });

  await prisma.alert.create({
    data: {
      userId: demoUser.id,
      productId: products[0].id,
      targetPrice: 65000,
      status: 'active',
    },
  });
  console.log(`🔔 Seeded TrackedProduct & Alert for Demo User`);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
