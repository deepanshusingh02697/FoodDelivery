import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  RestaurantStatus,
} from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("adm123@&", 10);

  // =====================
  // ADMIN
  // =====================

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@foodapp.com",
    },
    update: {},
    create: {
      firstname: "Super",
      lastname: "Admin",
      email: "admin@foodapp.com",
      phone: "9999999999",
      password,
      role: Role.ADMIN,
      phoneVerified: true,
    },
  });

  // =====================
  // RESTAURANT OWNERS
  // =====================

  const owner1 = await prisma.user.upsert({
    where: {
      email: "rahul@spicegarden.com",
    },
    update: {},
    create: {
      firstname: "Rahul",
      lastname: "Sharma",
      email: "rahul@spicegarden.com",
      phone: "8888888888",
      password,
      role: Role.OWNER,
      phoneVerified: true,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: {
      email: "amit@gmail.com",
    },
    update: {},
    create: {
      firstname: "Amit",
      lastname: "Verma",
      email: "amit@gmail.com",
      phone: "7777777777",
      password,
      role: Role.OWNER,
      phoneVerified: true,
    },
  });

  // =====================
  // RESTAURANTS
  // =====================

  const spiceGarden = await prisma.restaurant.create({
    data: {
      restaurantName: "Spice Garden",
      cuisine: "North Indian",
      address: "MG Road, Bangalore",
      phone: "8888888888",
      fssaiNumber: "12345678901234",
      gstNumber: "29ABCDE1234F1Z5",

      status: RestaurantStatus.APPROVED,

      ownerId: owner1.id,

      approvedBy: admin.id,
      approvedAt: new Date(),
      adminNote: "Verified restaurant",
    },
  });

  const burgerHub = await prisma.restaurant.create({
    data: {
      restaurantName: "Burger Hub",
      cuisine: "Fast Food",
      address: "Koramangala, Bangalore",
      phone: "7777777777",

      status: RestaurantStatus.APPROVED,

      ownerId: owner2.id,

      approvedBy: admin.id,
      approvedAt: new Date(),
    },
  });

  // =====================
  // MENU ITEMS
  // =====================

  await prisma.menuItem.createMany({
    data: [
      {
        name: "Chicken Biryani",
        description: "Hyderabadi style spicy chicken biryani",
        price: 220,
        category: "Biryani",
        isVeg: false,
        imageUrl:
          "https://res.cloudinary.com/delubzbh2/image/upload/v1784400937/FoodDelivery/jmgmhpz0e9vvobusyf6k.jpg",
        restaurantId: spiceGarden.id,
      },

      {
        name: "Paneer Butter Masala",
        description: "Creamy paneer curry",
        price: 180,
        category: "Main Course",
        isVeg: true,
        imageUrl:
          "https://res.cloudinary.com/delubzbh2/image/upload/v1784400826/FoodDelivery/dwbm21mcxc7epr9fq7p5.jpg",
        restaurantId: spiceGarden.id,
      },

      {
        name: "Masala Dosa",
        description: "South Indian crispy dosa",
        price: 90,
        category: "South Indian",
        isVeg: true,
        imageUrl:
          "https://res.cloudinary.com/delubzbh2/image/upload/v1785174361/FoodDelivery/cgjunwvwngqfzkxhmkhl.webp",

        restaurantId: spiceGarden.id,
      },

      {
        name: "Classic Cheese Burger",
        description: "Loaded cheese burger",
        price: 150,
        category: "Burger",
        isVeg: true,
        imageUrl:
          "https://res.cloudinary.com/delubzbh2/image/upload/v1785174417/FoodDelivery/vt6cb4cyadkat8tcjoi8.jpg",

        restaurantId: burgerHub.id,
      },

      {
        name: "Chicken Burger",
        description: "Grilled chicken burger",
        price: 220,
        category: "Burger",
        isVeg: false,
        imageUrl:
          "https://res.cloudinary.com/delubzbh2/image/upload/v1785174485/FoodDelivery/rt7mosg3ye1nqb4akxmf.jpg",

        restaurantId: burgerHub.id,
      },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
