const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
const User = require("./models/User");
const connectDB = require("./config/db");
const mockProducts = require("./data/products");
const fs = require("fs");
const path = require("path");

dotenv.config();
const importData = async () => {
  try {
    await connectDB();
    console.log("Clearing old data...");
    await Product.deleteMany();
    // Delete only the seeder-generated sellers to maintain idempotency
    await User.deleteMany({ email: { $regex: "@seller.minimarthub.com$" } });

    console.log("Processing unique sellers...");
    // Extract unique prefix blocks (hb, ag, tc, etc.)
    const uniquePrefixes = [...new Set(mockProducts.map((p) => p.id.replace(/[0-9]/g, "")))];

    const sellerNamesList = [
      "Agro Chem Center", "Govibhima Agro", "Lanka Grocery Mart",
      "Ceylon Beauty Co", "Colombo Fashion House", "Fitzone Sports",
      "Glow Essentials", "Heritage Crafts Studio", "Home Essentials Lanka",
      "Kids World Lanka", "Kitchen Craft Co", "Lanka Book House",
      "Lanka Handicrafts", "Little Stars Baby Shop", "Office Supplies Co",
      "Pet Paradise Lanka", "Smart IT Solutions", "Spice Garden Foods",
      "Techzone LK", "Tool Town", "Trendy Threads", "Active Gear Lanka",
      "Animal Care Center", "Buildmart Lanka"
    ];

    const sellerImageMap = {
      "Active Gear Lanka": "/sellers/active-gear-lanka.png",
      "Agro Chem Center": "/sellers/agro-chem-center.png",
      "Animal Care Center": "/sellers/animal-care-center.png",
      "Buildmart Lanka": "/sellers/buildmart-lanka.png",
      "Ceylon Beauty Co": "/sellers/ceylon-beauty-co.png",
      "Colombo Fashion House": "/sellers/colombo-fashion-house.png",
      "Fitzone Sports": "/sellers/fitzone-sports.png",
      "Glow Essentials": "/sellers/glow-essentials.png",
      "Govibhima Agro": "/sellers/govibhima-agro.png",
      "Heritage Crafts Studio": "/sellers/heritage-crafts-studio.png",
      "Home Essentials Lanka": "/sellers/home-essentials-lanka.png",
      "Kids World Lanka": "/sellers/kids-world-lanka.png",
      "Kitchen Craft Co": "/sellers/kitchen-craft-co.png",
      "Lanka Book House": "/sellers/lanka-book-house.png",
      "Lanka Grocery Mart": "/sellers/lanka-grocery-mart.png",
      "Lanka Handicrafts": "/sellers/lanka-handicrafts.png",
      "Little Stars Baby Shop": "/sellers/little-stars-baby-shop.png",
      "Office Supplies Co": "/sellers/office-supplies-co.png",
      "Pet Paradise Lanka": "/sellers/pet-paradise-lanka.png",
      "Smart IT Solutions": "/sellers/smart-it-solutions.png",
      "Spice Garden Foods": "/sellers/spice-garden-foods.png",
      "Techzone LK": "/sellers/techzone-lk.png",
      "Tool Town": "/sellers/tool-town.png",
      "Trendy Threads": "/sellers/trendy-threads.png"
    };

    const hashedPassword = await bcrypt.hash("12345678", 12);
    
    const sellerUsersData = uniquePrefixes.map((prefix, i) => {
      const sellerName = sellerNamesList[i % sellerNamesList.length];
      const newSeller = {
        name: sellerName,
        email: `${prefix}@seller.minimarthub.com`,
        phone: "0770000000",
        password: hashedPassword,
        role: "seller",
        image: sellerImageMap[sellerName],
        rating: 4.8
      };
      console.log(newSeller);
      return newSeller;
    });

    console.log(`Creating ${sellerUsersData.length} sellers...`);
    const createdSellers = await User.insertMany(sellerUsersData);

    // Map prefix to generated MongoDB ObjectId
    const prefixToSellerId = {};
    createdSellers.forEach((seller) => {
      const prefix = seller.email.split("@")[0];
      prefixToSellerId[prefix] = seller._id;
    });

    console.log("Gathering local images...");
    const productsDir = path.join(__dirname, "../frontend/public/products");
    const localImages = [];
    if (fs.existsSync(productsDir)) {
      const categories = fs.readdirSync(productsDir);
      categories.forEach((category) => {
        const categoryPath = path.join(productsDir, category);
        if (fs.statSync(categoryPath).isDirectory()) {
          const files = fs.readdirSync(categoryPath);
          files.forEach((file) => {
            if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
              localImages.push(`/products/${category}/${file}`);
            }
          });
        }
      });
    }
    console.log(`Found ${localImages.length} local images.`);

    console.log("Formatting products...");
    const sampleProducts = mockProducts.map((p, index) => {
      let stockNum = 50; // default numeric stock fallback
      if (typeof p.stock === "number") {
        stockNum = p.stock;
      } else if (typeof p.stock === "string") {
        const parsed = parseInt(p.stock.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(parsed) && parsed > 0) {
          stockNum = parsed;
        }
      }

      const prefix = p.id.replace(/[0-9]/g, "");
      
      let imagePath = p.image;
      if (localImages.length > 0) {
        imagePath = localImages[index % localImages.length];
      }

      return {
        name: p.title,
        description: `${p.title} - ${p.category}. Outstanding quality from MiniMartHub.`,
        price: p.price,
        category: p.category,
        stock: stockNum,
        image: imagePath, // Use local image path
        seller: prefixToSellerId[prefix],
      };
    });

    console.log(`Inserting ${sampleProducts.length} products...`);
    await Product.insertMany(sampleProducts);
    
    console.log("Data Imported Successfully! (Idempotent run complete)");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
