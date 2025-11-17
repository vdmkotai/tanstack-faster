import * as dotenv from "dotenv";
import fs from "node:fs";

// IMPORTANT: load environment variables BEFORE any other imports
{
  const candidates = ["./.env.local", "./.env.development", "./.env"];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file });
      break;
    }
  }
}

import slugify from "slugify";
import { ulid } from "ulidx";
import { db } from "../src/db";
import {
  collections,
  categories,
  subcollections,
  subcategories,
  products,
} from "../src/db/schema";

async function generateTestData() {
  console.log("🚀 Generating test data...");

  try {
    // Create collections
    const collectionData = [
      { name: "Electronics", slug: "electronics" },
      { name: "Fashion", slug: "fashion" },
      { name: "Home & Garden", slug: "home-garden" },
    ];

    const createdCollections = [];
    for (const col of collectionData) {
      const id = ulid();
      await db.insert(collections).values({
        id,
        name: col.name,
        slug: col.slug,
      });
      createdCollections.push({ id, ...col });
      console.log(`✅ Created collection: ${col.name}`);
    }

    // Create categories for each collection
    const categoryData = [
      {
        name: "Smartphones",
        slug: "smartphones",
        collectionSlug: "electronics",
        imageUrl: "https://picsum.photos/seed/smartphone/800/600",
      },
      {
        name: "Laptops",
        slug: "laptops",
        collectionSlug: "electronics",
        imageUrl: "https://picsum.photos/seed/laptop/800/600",
      },
      {
        name: "Men's Clothing",
        slug: "mens-clothing",
        collectionSlug: "fashion",
        imageUrl: "https://picsum.photos/seed/mensfashion/800/600",
      },
      {
        name: "Women's Clothing",
        slug: "womens-clothing",
        collectionSlug: "fashion",
        imageUrl: "https://picsum.photos/seed/womensfashion/800/600",
      },
      {
        name: "Furniture",
        slug: "furniture",
        collectionSlug: "home-garden",
        imageUrl: "https://picsum.photos/seed/furniture/800/600",
      },
      {
        name: "Garden Tools",
        slug: "garden-tools",
        collectionSlug: "home-garden",
        imageUrl: "https://picsum.photos/seed/garden/800/600",
      },
    ];

    for (const cat of categoryData) {
      const collection = createdCollections.find(
        (c) => c.slug === cat.collectionSlug
      );
      if (collection) {
        await db.insert(categories).values({
          slug: cat.slug,
          name: cat.name,
          collection_id: collection.id,
          image_url: cat.imageUrl,
        });
        console.log(`✅ Created category: ${cat.name}`);
      }
    }

    // Create subcollections
    const subcollectionData = [
      {
        name: "Premium Phones",
        categorySlug: "smartphones",
      },
      { name: "Budget Phones", categorySlug: "smartphones" },
      { name: "Gaming Laptops", categorySlug: "laptops" },
      { name: "Business Laptops", categorySlug: "laptops" },
      { name: "T-Shirts", categorySlug: "mens-clothing" },
      { name: "Dresses", categorySlug: "womens-clothing" },
      { name: "Living Room", categorySlug: "furniture" },
      { name: "Hand Tools", categorySlug: "garden-tools" },
    ];

    const createdSubcollections = [];
    for (const subcol of subcollectionData) {
      const id = ulid();
      await db.insert(subcollections).values({
        id,
        name: subcol.name,
        category_slug: subcol.categorySlug,
      });
      createdSubcollections.push({ id, ...subcol });
      console.log(`✅ Created subcollection: ${subcol.name}`);
    }

    // Create subcategories
    const subcategoryData = [
      {
        name: "iPhone",
        slug: "iphone",
        subcollectionName: "Premium Phones",
        imageUrl: "https://picsum.photos/seed/iphone/800/600",
      },
      {
        name: "Samsung Galaxy",
        slug: "samsung-galaxy",
        subcollectionName: "Premium Phones",
        imageUrl: "https://picsum.photos/seed/samsung/800/600",
      },
      {
        name: "Xiaomi",
        slug: "xiaomi",
        subcollectionName: "Budget Phones",
        imageUrl: "https://picsum.photos/seed/xiaomi/800/600",
      },
      {
        name: "Realme",
        slug: "realme",
        subcollectionName: "Budget Phones",
        imageUrl: "https://picsum.photos/seed/realme/800/600",
      },
      {
        name: "ASUS ROG",
        slug: "asus-rog",
        subcollectionName: "Gaming Laptops",
        imageUrl: "https://picsum.photos/seed/asus-rog/800/600",
      },
      {
        name: "Dell XPS",
        slug: "dell-xps",
        subcollectionName: "Business Laptops",
        imageUrl: "https://picsum.photos/seed/dell-xps/800/600",
      },
      {
        name: "Casual T-Shirts",
        slug: "casual-t-shirts",
        subcollectionName: "T-Shirts",
        imageUrl: "https://picsum.photos/seed/tshirt/800/600",
      },
      {
        name: "Summer Dresses",
        slug: "summer-dresses",
        subcollectionName: "Dresses",
        imageUrl: "https://picsum.photos/seed/dress/800/600",
      },
      {
        name: "Sofas",
        slug: "sofas",
        subcollectionName: "Living Room",
        imageUrl: "https://picsum.photos/seed/sofa/800/600",
      },
      {
        name: "Pruning Tools",
        slug: "pruning-tools",
        subcollectionName: "Hand Tools",
        imageUrl: "https://picsum.photos/seed/pruning-tools/800/600",
      },
    ];

    for (const subcat of subcategoryData) {
      const subcollection = createdSubcollections.find(
        (sc) => sc.name === subcat.subcollectionName
      );
      if (subcollection) {
        await db.insert(subcategories).values({
          slug: subcat.slug,
          name: subcat.name,
          subcollection_id: subcollection.id,
          image_url: subcat.imageUrl,
        });
        console.log(`✅ Created subcategory: ${subcat.name}`);
      }
    }

    // Create products for each subcategory
    console.log("📦 Generating products...");

    const productTemplates = [
      {
        subcatSlug: "iphone",
        baseName: "iPhone",
        basePrice: 699,
        count: 30,
        imageQuery: "iphone,apple,smartphone",
      },
      {
        subcatSlug: "samsung-galaxy",
        baseName: "Samsung Galaxy",
        basePrice: 599,
        count: 30,
        imageQuery: "samsung,android,smartphone",
      },
      {
        subcatSlug: "xiaomi",
        baseName: "Xiaomi Phone",
        basePrice: 199,
        count: 25,
        imageQuery: "smartphone,phone,mobile",
      },
      {
        subcatSlug: "realme",
        baseName: "Realme Phone",
        basePrice: 179,
        count: 25,
        imageQuery: "smartphone,android,phone",
      },
      {
        subcatSlug: "asus-rog",
        baseName: "ASUS ROG Laptop",
        basePrice: 1499,
        count: 20,
        imageQuery: "gaming,laptop,computer",
      },
      {
        subcatSlug: "dell-xps",
        baseName: "Dell XPS",
        basePrice: 1299,
        count: 20,
        imageQuery: "laptop,computer,business",
      },
      {
        subcatSlug: "casual-t-shirts",
        baseName: "T-Shirt",
        basePrice: 19,
        count: 40,
        imageQuery: "tshirt,clothing,fashion",
      },
      {
        subcatSlug: "summer-dresses",
        baseName: "Summer Dress",
        basePrice: 49,
        count: 35,
        imageQuery: "dress,fashion,clothing",
      },
      {
        subcatSlug: "sofas",
        baseName: "Sofa",
        basePrice: 599,
        count: 15,
        imageQuery: "sofa,furniture,interior",
      },
      {
        subcatSlug: "pruning-tools",
        baseName: "Pruning Tool",
        basePrice: 29,
        count: 20,
        imageQuery: "garden,tools,equipment",
      },
    ];

    let totalProducts = 0;
    for (const template of productTemplates) {
      const productsData = Array.from({ length: template.count }, (_, i) => {
        const num = (i + 1).toString().padStart(3, "0");
        const name = `${template.baseName} Model ${num}`;
        const priceVariation = Math.floor(Math.random() * 200) - 100;
        // Use Lorem Picsum with unique seeds for each product
        const imageUrl = `https://picsum.photos/seed/${template.subcatSlug}-${i}/800/800`;
        return {
          slug: slugify(`${name}-${ulid().slice(-6)}`, { lower: true }),
          name,
          description: `High-quality ${template.baseName} with excellent features and modern design. Perfect for everyday use.`,
          price: Math.max(10, template.basePrice + priceVariation).toString(),
          subcategory_slug: template.subcatSlug,
          image_url: imageUrl,
        };
      });

      await db.insert(products).values(productsData);
      totalProducts += productsData.length;
    }

    console.log(`✅ Created ${totalProducts} products`);

    console.log("\n🎉 Test data generated successfully!");
    console.log("📱 Collections created: 3");
    console.log("📂 Categories created: 6");
    console.log("📋 Subcollections created: 8");
    console.log("🏷️  Subcategories created: 10");
    console.log(`📦 Products created: ${totalProducts}`);
    console.log("\n🌐 You can now browse:");
    console.log("   - http://localhost:8080/electronics");
    console.log("   - http://localhost:8080/fashion");
    console.log("   - http://localhost:8080/home-garden");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error generating test data:", error);
    process.exit(1);
  }
}

generateTestData();
