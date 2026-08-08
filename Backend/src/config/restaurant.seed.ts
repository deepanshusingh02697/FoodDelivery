import {
  Restaurant,
  RestaurantStatus,
} from "../entity/restaurant.entity.js";

import { MenuItem } from "../entity/menuitem.entity.js";

import {
  restaurantRepository,
  menuItemRepository,
} from "../repositories/repository.js";

import { AppDataSource } from "./data-source.js";

async function seedRestaurants() {
  try {
    await AppDataSource.initialize();

    console.log("Database connected");

    const restaurants: Partial<Restaurant>[] = [
      {
        restaurantName: "Spice Garden",
        cuisine: "Indian",
        address: "MG Road, Bangalore",
        fssaiNumber: "12345678901234",
        gstNumber: "29ABCDE1234F1Z5",
        phone: "9876500001",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-01T10:00:00Z"),
        adminNote: "Restaurant approved successfully",
      },

      {
        restaurantName: "Pizza Palace",
        cuisine: "Italian",
        address: "Indiranagar, Bangalore",
        fssaiNumber: "12345678901235",
        gstNumber: "29ABCDE5678F1Z5",
        phone: "9876500002",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-02T11:00:00Z"),
        adminNote: "Restaurant documents verified and approved",
      },

      {
        restaurantName: "Burger House",
        cuisine: "American",
        address: "Koramangala, Bangalore",
        fssaiNumber: "12345678901236",
        gstNumber: "29ABCDE9876F1Z5",
        phone: "9876500003",
        status: RestaurantStatus.APPROVED,
        ownerId: 4,
        approvedBy: 1,
        approvedAt: new Date("2026-08-03T12:00:00Z"),
        adminNote: "Restaurant approved successfully",
      },

      {
        restaurantName: "Fresh Bites",
        cuisine: "Healthy",
        address: "HSR Layout, Bangalore",
        fssaiNumber: "12345678901237",
        gstNumber: "29ABCDE1111F1Z5",
        phone: "9876500004",
        status: RestaurantStatus.PENDING,
        ownerId: 4,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },

      {
        restaurantName: "Tandoori Hub",
        cuisine: "North Indian",
        address: "Whitefield, Bangalore",
        fssaiNumber: "12345678901238",
        gstNumber: "29ABCDE2222F1Z5",
        phone: "9876500005",
        status: RestaurantStatus.REJECTED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-04T14:00:00Z"),
        adminNote: "Required documents were not provided",
      },

      {
        restaurantName: "South Spice",
        cuisine: "South Indian",
        address: "Jayanagar, Bangalore",
        fssaiNumber: "12345678901239",
        gstNumber: "29ABCDE3333F1Z5",
        phone: "9876500006",
        status: RestaurantStatus.PENDING,
        ownerId: 4,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },

      {
        restaurantName: "Saffron Leaf",
        cuisine: "Rajasthani",
        address: "Cunningham Road, Bangalore",
        fssaiNumber: "22345678901234",
        gstNumber: "29BCDEF1234G1Z5",
        phone: "9887601001",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T10:00:00Z"),
        adminNote: "All documents verified and approved",
      },

      {
        restaurantName: "Urban Tiffin Co",
        cuisine: "Indian",
        address: "Bellandur, Bangalore",
        fssaiNumber: "22345678901235",
        gstNumber: "29BCDEF2345G1Z5",
        phone: "9887601002",
        status: RestaurantStatus.APPROVED,
        ownerId: 4,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T10:15:00Z"),
        adminNote: "Restaurant approved after verification",
      },

      {
        restaurantName: "Olive Terrace",
        cuisine: "Mediterranean",
        address: "Sadashivanagar, Bangalore",
        fssaiNumber: "22345678901236",
        gstNumber: "29BCDEF3456G1Z5",
        phone: "9887601003",
        status: RestaurantStatus.PENDING,
        ownerId: 3,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },

      {
        restaurantName: "Wok & Flame",
        cuisine: "Asian Fusion",
        address: "Sarjapur Road, Bangalore",
        fssaiNumber: "22345678901237",
        gstNumber: "29BCDEF4567G1Z5",
        phone: "9887601004",
        status: RestaurantStatus.APPROVED,
        ownerId: 4,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T10:30:00Z"),
        adminNote: "Restaurant approved successfully",
      },

      {
        restaurantName: "Basil & Bean",
        cuisine: "Continental",
        address: "Richmond Town, Bangalore",
        fssaiNumber: "22345678901238",
        gstNumber: "29BCDEF5678G1Z5",
        phone: "9887601005",
        status: RestaurantStatus.PENDING,
        ownerId: 3,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },

      {
        restaurantName: "Charcoal Junction",
        cuisine: "Grill",
        address: "Banashankari, Bangalore",
        fssaiNumber: "22345678901239",
        gstNumber: "29BCDEF6789G1Z5",
        phone: "9887601006",
        status: RestaurantStatus.APPROVED,
        ownerId: 4,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T10:45:00Z"),
        adminNote: "Food safety documents verified",
      },

      {
        restaurantName: "Namma Oota",
        cuisine: "Karnataka",
        address: "Vijayanagar, Bangalore",
        fssaiNumber: "22345678901240",
        gstNumber: "29BCDEF7890G1Z5",
        phone: "9887601007",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T11:00:00Z"),
        adminNote: "Restaurant approved successfully",
      },

      {
        restaurantName: "Citrus Table",
        cuisine: "European",
        address: "Domlur, Bangalore",
        fssaiNumber: "22345678901241",
        gstNumber: "29BCDEF8901G1Z5",
        phone: "9887601008",
        status: RestaurantStatus.REJECTED,
        ownerId: 4,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T11:15:00Z"),
        adminNote: "Required compliance documents were incomplete",
      },

      {
        restaurantName: "Mango Chilli",
        cuisine: "Thai",
        address: "Hennur Road, Bangalore",
        fssaiNumber: "22345678901242",
        gstNumber: "29BCDEF9012G1Z5",
        phone: "9887601009",
        status: RestaurantStatus.PENDING,
        ownerId: 3,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },

      {
        restaurantName: "The Curry Room",
        cuisine: "Indian",
        address: "Kalyan Nagar, Bangalore",
        fssaiNumber: "22345678901243",
        gstNumber: "29BCDEG1234H1Z5",
        phone: "9887601010",
        status: RestaurantStatus.APPROVED,
        ownerId: 4,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T11:30:00Z"),
        adminNote: "Restaurant documents verified",
      },

      {
        restaurantName: "Firestone Kitchen",
        cuisine: "Barbecue",
        address: "Yelahanka, Bangalore",
        fssaiNumber: "22345678901244",
        gstNumber: "29BCDEG2345H1Z5",
        phone: "9887601011",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T11:45:00Z"),
        adminNote: "Approved after successful inspection",
      },

      {
        restaurantName: "Harvest Bowl",
        cuisine: "Vegan",
        address: "Brookefield, Bangalore",
        fssaiNumber: "22345678901245",
        gstNumber: "29BCDEG3456H1Z5",
        phone: "9887601012",
        status: RestaurantStatus.PENDING,
        ownerId: 4,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },

      {
        restaurantName: "Bamboo Garden",
        cuisine: "Chinese",
        address: "RT Nagar, Bangalore",
        fssaiNumber: "22345678901246",
        gstNumber: "29BCDEG4567H1Z5",
        phone: "9887601013",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T12:00:00Z"),
        adminNote: "All required documents approved",
      },

      {
        restaurantName: "Kebab Junction",
        cuisine: "Mughlai",
        address: "Shivajinagar, Bangalore",
        fssaiNumber: "22345678901247",
        gstNumber: "29BCDEG5678H1Z5",
        phone: "9887601014",
        status: RestaurantStatus.REJECTED,
        ownerId: 4,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T12:15:00Z"),
        adminNote: "Food safety certificate could not be verified",
      },

      {
        restaurantName: "Morning Brew",
        cuisine: "Cafe",
        address: "Lavelle Road, Bangalore",
        fssaiNumber: "22345678901248",
        gstNumber: "29BCDEG6789H1Z5",
        phone: "9887601015",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T12:30:00Z"),
        adminNote: "Cafe registration approved",
      },

      {
        restaurantName: "Coastal Pearl",
        cuisine: "Mangalorean",
        address: "Varthur, Bangalore",
        fssaiNumber: "22345678901249",
        gstNumber: "29BCDEG7890H1Z5",
        phone: "9887601016",
        status: RestaurantStatus.PENDING,
        ownerId: 4,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },

      {
        restaurantName: "Rice & Spice",
        cuisine: "Hyderabadi",
        address: "Kundalahalli, Bangalore",
        fssaiNumber: "22345678901250",
        gstNumber: "29BCDEG8901H1Z5",
        phone: "9887601017",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T12:45:00Z"),
        adminNote: "Restaurant approved successfully",
      },

      {
        restaurantName: "Garden Grains",
        cuisine: "Organic",
        address: "Nagarbhavi, Bangalore",
        fssaiNumber: "22345678901251",
        gstNumber: "29BCDEG9012H1Z5",
        phone: "9887601018",
        status: RestaurantStatus.PENDING,
        ownerId: 4,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },

      {
        restaurantName: "Royal Tawa",
        cuisine: "North Indian",
        address: "Basaveshwaranagar, Bangalore",
        fssaiNumber: "22345678901252",
        gstNumber: "29BCDEH1234J1Z5",
        phone: "9887601019",
        status: RestaurantStatus.APPROVED,
        ownerId: 3,
        approvedBy: 1,
        approvedAt: new Date("2026-08-08T13:00:00Z"),
        adminNote: "Restaurant approved after document verification",
      },

      {
        restaurantName: "Little Tokyo",
        cuisine: "Japanese",
        address: "RMV 2nd Stage, Bangalore",
        fssaiNumber: "22345678901253",
        gstNumber: "29BCDEH2345J1Z5",
        phone: "9887601020",
        status: RestaurantStatus.PENDING,
        ownerId: 4,
        approvedBy: undefined,
        approvedAt: undefined,
        adminNote: undefined,
      },
    ];

    // FIRST save restaurants
    const savedRestaurants =
      await restaurantRepository.save(restaurants);

    console.log(
      `Created ${savedRestaurants.length} restaurants`
    );

    // =========================================================
    // CLOUDINARY IMAGES
    // =========================================================

    const image1 =
      "https://res.cloudinary.com/delubzbh2/image/upload/v1785686448/FoodDelivery/rvukbucw85v5jb0kupa2.avif";

    const image2 =
      "https://res.cloudinary.com/delubzbh2/image/upload/v1785686739/FoodDelivery/bezq1ayvc4zfmb6reih9.jpg";

    // =========================================================
    // MENU ITEMS
    // =========================================================

    const menuItems: Partial<MenuItem>[] = [
      // =====================================================
      // 0 - Spice Garden
      // =====================================================

      {
        name: "Butter Chicken",
        description:
          "Creamy and flavorful chicken cooked in a rich tomato gravy.",
        category: "Main Course",
        price: 320,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[0].id,
      },

      {
        name: "Paneer Tikka",
        description:
          "Grilled cottage cheese marinated with Indian spices.",
        category: "Starters",
        price: 240,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: savedRestaurants[0].id,
      },

      {
        name: "Garlic Naan",
        description:
          "Soft naan topped with garlic and coriander.",
        category: "Bread",
        price: 80,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: false,
        stockQuantity: null,
        restaurantId: savedRestaurants[0].id,
      },

      // =====================================================
      // 1 - Pizza Palace
      // =====================================================

      {
        name: "Margherita Pizza",
        description:
          "Classic pizza topped with tomato sauce, mozzarella and basil.",
        category: "Pizza",
        price: 280,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[1].id,
      },

      {
        name: "Chicken Pepperoni Pizza",
        description:
          "Cheesy pizza topped with chicken pepperoni and herbs.",
        category: "Pizza",
        price: 390,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[1].id,
      },

      {
        name: "Penne Alfredo",
        description:
          "Penne pasta tossed in creamy Alfredo sauce.",
        category: "Pasta",
        price: 310,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: false,
        stockQuantity: null,
        restaurantId: savedRestaurants[1].id,
      },

      // =====================================================
      // 2 - Burger House
      // =====================================================

      {
        name: "Classic Chicken Burger",
        description:
          "Crispy chicken patty with lettuce, cheese and special sauce.",
        category: "Burgers",
        price: 220,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[2].id,
      },

      {
        name: "Veggie Supreme Burger",
        description:
          "Loaded vegetable patty burger with cheese and fresh vegetables.",
        category: "Burgers",
        price: 190,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[2].id,
      },

      {
        name: "Loaded French Fries",
        description:
          "Crispy fries topped with cheese and special seasoning.",
        category: "Sides",
        price: 150,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: false,
        stockQuantity: null,
        restaurantId: savedRestaurants[2].id,
      },

      // =====================================================
      // 3 - Fresh Bites
      // =====================================================

      {
        name: "Avocado Salad Bowl",
        description:
          "Fresh avocado, lettuce, tomatoes, cucumber and healthy dressing.",
        category: "Salads",
        price: 280,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[3].id,
      },

      {
        name: "Grilled Chicken Bowl",
        description:
          "Grilled chicken served with vegetables, brown rice and dressing.",
        category: "Healthy Bowls",
        price: 340,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[3].id,
      },

      {
        name: "Fruit & Yogurt Bowl",
        description:
          "Fresh seasonal fruits with creamy yogurt and granola.",
        category: "Breakfast",
        price: 210,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 12,
        restaurantId: savedRestaurants[3].id,
      },

      // =====================================================
      // 4 - Tandoori Hub
      // =====================================================

      {
        name: "Tandoori Chicken",
        description:
          "Chicken marinated in spices and roasted in a traditional tandoor.",
        category: "Tandoor",
        price: 360,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[4].id,
      },

      {
        name: "Chicken Seekh Kebab",
        description:
          "Minced chicken kebabs seasoned with aromatic Indian spices.",
        category: "Kebabs",
        price: 300,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 22,
        restaurantId: savedRestaurants[4].id,
      },

      {
        name: "Tandoori Paneer",
        description:
          "Paneer cubes marinated in spices and grilled in a tandoor.",
        category: "Tandoor",
        price: 280,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[4].id,
      },

      // =====================================================
      // 5 - South Spice
      // =====================================================

      {
        name: "Masala Dosa",
        description:
          "Crispy dosa filled with spiced potato masala.",
        category: "South Indian",
        price: 120,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 40,
        restaurantId: savedRestaurants[5].id,
      },

      {
        name: "Idli Sambar",
        description:
          "Soft steamed idlis served with hot sambar and chutney.",
        category: "South Indian",
        price: 100,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 35,
        restaurantId: savedRestaurants[5].id,
      },

      {
        name: "Medu Vada",
        description:
          "Crispy South Indian lentil fritters served with sambar.",
        category: "South Indian",
        price: 110,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: savedRestaurants[5].id,
      },

      // =====================================================
      // 6 - Saffron Leaf
      // =====================================================

      {
        name: "Dal Baati Churma",
        description:
          "Traditional Rajasthani dal served with baati and sweet churma.",
        category: "Rajasthani",
        price: 280,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[6].id,
      },

      {
        name: "Laal Maas",
        description:
          "Spicy Rajasthani mutton curry cooked with red chillies.",
        category: "Main Course",
        price: 420,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[6].id,
      },

      {
        name: "Gatte Ki Sabzi",
        description:
          "Rajasthani gram flour dumplings cooked in a yogurt-based gravy.",
        category: "Main Course",
        price: 240,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[6].id,
      },

      // =====================================================
      // 7 - Urban Tiffin Co
      // =====================================================

      {
        name: "Paneer Butter Masala",
        description:
          "Soft paneer cooked in a rich buttery tomato gravy.",
        category: "Main Course",
        price: 260,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[7].id,
      },

      {
        name: "Chicken Biryani",
        description:
          "Fragrant basmati rice cooked with chicken and aromatic spices.",
        category: "Biryani",
        price: 320,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: savedRestaurants[7].id,
      },

      {
        name: "Chole Bhature",
        description:
          "Spicy chickpea curry served with fluffy fried bhature.",
        category: "North Indian",
        price: 180,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: savedRestaurants[7].id,
      },

      // =====================================================
      // 8 - Olive Terrace
      // =====================================================

      {
        name: "Greek Salad",
        description:
          "Fresh cucumber, tomato, olives, feta cheese and herbs.",
        category: "Salads",
        price: 290,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[8].id,
      },

      {
        name: "Mediterranean Pasta",
        description:
          "Pasta tossed with olives, vegetables, herbs and creamy sauce.",
        category: "Pasta",
        price: 340,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: false,
        stockQuantity: null,
        restaurantId: savedRestaurants[8].id,
      },

      {
        name: "Chicken Shawarma Plate",
        description:
          "Seasoned grilled chicken served with pita and Mediterranean sides.",
        category: "Main Course",
        price: 360,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[8].id,
      },

      // =====================================================
      // 9 - Wok & Flame
      // =====================================================

      {
        name: "Veg Hakka Noodles",
        description:
          "Stir-fried noodles tossed with fresh vegetables and Asian sauces.",
        category: "Noodles",
        price: 190,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: savedRestaurants[9].id,
      },

      {
        name: "Chicken Fried Rice",
        description:
          "Wok-tossed rice with chicken, vegetables and Asian seasoning.",
        category: "Rice",
        price: 240,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 28,
        restaurantId: savedRestaurants[9].id,
      },

      {
        name: "Chilli Paneer",
        description:
          "Crispy paneer tossed with peppers, onions and chilli sauce.",
        category: "Starters",
        price: 230,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[9].id,
      },

      // =====================================================
      // 10 - Basil & Bean
      // =====================================================

      {
        name: "Creamy Mushroom Pasta",
        description:
          "Italian pasta cooked with mushrooms in a creamy sauce.",
        category: "Pasta",
        price: 330,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[10].id,
      },

      {
        name: "Grilled Chicken Steak",
        description:
          "Juicy grilled chicken steak served with vegetables.",
        category: "Main Course",
        price: 420,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[10].id,
      },

      {
        name: "Classic Pancakes",
        description:
          "Fluffy pancakes served with butter and maple syrup.",
        category: "Breakfast",
        price: 220,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[10].id,
      },

      // =====================================================
      // 11 - Charcoal Junction
      // =====================================================

      {
        name: "Chicken Tikka",
        description:
          "Charcoal-grilled chicken pieces marinated in aromatic spices.",
        category: "Grill",
        price: 320,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[11].id,
      },

      {
        name: "Grilled Paneer Skewers",
        description:
          "Paneer and vegetables grilled over charcoal.",
        category: "Grill",
        price: 280,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[11].id,
      },

      {
        name: "Smoky BBQ Chicken",
        description:
          "Tender chicken coated with smoky barbecue sauce.",
        category: "Barbecue",
        price: 380,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[11].id,
      },

      // =====================================================
      // 12 - Namma Oota
      // =====================================================

      {
        name: "Bisi Bele Bath",
        description:
          "Traditional Karnataka rice dish cooked with lentils and vegetables.",
        category: "Karnataka",
        price: 160,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: savedRestaurants[12].id,
      },

      {
        name: "Ragi Mudde",
        description:
          "Traditional Karnataka ragi balls served with spicy curry.",
        category: "Karnataka",
        price: 180,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[12].id,
      },

      {
        name: "Mangalore Bun",
        description:
          "Soft and slightly sweet fried bread served with chutney.",
        category: "Snacks",
        price: 100,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 35,
        restaurantId: savedRestaurants[12].id,
      },

      // =====================================================
      // 13 - Citrus Table
      // =====================================================

      {
        name: "Creamy Risotto",
        description:
          "Italian-style creamy risotto with herbs and parmesan.",
        category: "Italian",
        price: 380,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[13].id,
      },

      {
        name: "Herb Roasted Chicken",
        description:
          "Roasted chicken seasoned with fresh European herbs.",
        category: "Main Course",
        price: 450,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 12,
        restaurantId: savedRestaurants[13].id,
      },

      {
        name: "Chocolate Mousse",
        description:
          "Rich and smooth chocolate mousse served chilled.",
        category: "Desserts",
        price: 180,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[13].id,
      },

      // =====================================================
      // 14 - Mango Chilli
      // =====================================================

      {
        name: "Thai Green Curry",
        description:
          "Creamy Thai curry with vegetables and aromatic herbs.",
        category: "Thai",
        price: 320,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[14].id,
      },

      {
        name: "Thai Basil Chicken",
        description:
          "Chicken stir-fried with Thai basil and aromatic spices.",
        category: "Thai",
        price: 350,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[14].id,
      },

      {
        name: "Mango Sticky Rice",
        description:
          "Sweet sticky rice served with ripe mango and coconut sauce.",
        category: "Desserts",
        price: 190,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[14].id,
      },

      // =====================================================
      // 15 - The Curry Room
      // =====================================================

      {
        name: "Butter Naan",
        description:
          "Soft tandoori naan brushed with butter.",
        category: "Bread",
        price: 70,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 40,
        restaurantId: savedRestaurants[15].id,
      },

      {
        name: "Mutton Rogan Josh",
        description:
          "Slow-cooked mutton in a rich Kashmiri-style gravy.",
        category: "Main Course",
        price: 420,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[15].id,
      },

      {
        name: "Dal Makhani",
        description:
          "Slow-cooked black lentils finished with butter and cream.",
        category: "Main Course",
        price: 220,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[15].id,
      },

      // =====================================================
      // 16 - Firestone Kitchen
      // =====================================================

      {
        name: "Smoked Chicken Wings",
        description:
          "Juicy chicken wings smoked and finished with barbecue glaze.",
        category: "Barbecue",
        price: 320,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[16].id,
      },

      {
        name: "BBQ Chicken Platter",
        description:
          "Barbecue chicken served with grilled vegetables and fries.",
        category: "Barbecue",
        price: 450,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[16].id,
      },

      {
        name: "Grilled Corn",
        description:
          "Char-grilled corn seasoned with butter and spices.",
        category: "Sides",
        price: 120,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[16].id,
      },

      // =====================================================
      // 17 - Harvest Bowl
      // =====================================================

      {
        name: "Vegan Buddha Bowl",
        description:
          "Quinoa, chickpeas, avocado, vegetables and healthy dressing.",
        category: "Vegan",
        price: 320,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[17].id,
      },

      {
        name: "Tofu Teriyaki Bowl",
        description:
          "Grilled tofu with vegetables, rice and teriyaki sauce.",
        category: "Vegan",
        price: 300,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[17].id,
      },

      {
        name: "Avocado Toast",
        description:
          "Toasted bread topped with creamy avocado and herbs.",
        category: "Breakfast",
        price: 220,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: savedRestaurants[17].id,
      },

      // =====================================================
      // 18 - Bamboo Garden
      // =====================================================

      {
        name: "Veg Manchurian",
        description:
          "Crispy vegetable balls tossed in spicy Indo-Chinese sauce.",
        category: "Chinese",
        price: 210,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[18].id,
      },

      {
        name: "Chicken Manchow Soup",
        description:
          "Spicy chicken soup topped with crispy noodles.",
        category: "Soups",
        price: 180,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[18].id,
      },

      {
        name: "Schezwan Fried Rice",
        description:
          "Spicy fried rice tossed with vegetables and Schezwan sauce.",
        category: "Rice",
        price: 230,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: savedRestaurants[18].id,
      },

      // =====================================================
      // 19 - Kebab Junction
      // =====================================================

      {
        name: "Mutton Seekh Kebab",
        description:
          "Juicy minced mutton kebabs seasoned with Mughlai spices.",
        category: "Kebabs",
        price: 380,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[19].id,
      },

      {
        name: "Chicken Shami Kebab",
        description:
          "Soft minced chicken kebabs with aromatic spices.",
        category: "Kebabs",
        price: 300,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[19].id,
      },

      {
        name: "Mughlai Paneer",
        description:
          "Paneer cooked in a rich Mughlai-style creamy gravy.",
        category: "Main Course",
        price: 280,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[19].id,
      },

      // =====================================================
      // 20 - Morning Brew
      // =====================================================

      {
        name: "Cappuccino",
        description:
          "Classic espresso coffee topped with steamed milk foam.",
        category: "Coffee",
        price: 150,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 40,
        restaurantId: savedRestaurants[20].id,
      },

      {
        name: "Cold Coffee",
        description:
          "Chilled creamy coffee blended with milk and ice.",
        category: "Beverages",
        price: 180,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 35,
        restaurantId: savedRestaurants[20].id,
      },

      {
        name: "Chocolate Brownie",
        description:
          "Warm and fudgy chocolate brownie.",
        category: "Desserts",
        price: 160,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[20].id,
      },

      // =====================================================
      // 21 - Coastal Pearl
      // =====================================================

      {
        name: "Mangalorean Fish Curry",
        description:
          "Traditional coastal fish curry cooked with coconut and spices.",
        category: "Seafood",
        price: 360,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[21].id,
      },

      {
        name: "Neer Dosa",
        description:
          "Thin and soft rice crepes served with coconut chutney.",
        category: "South Indian",
        price: 130,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 35,
        restaurantId: savedRestaurants[21].id,
      },

      {
        name: "Chicken Ghee Roast",
        description:
          "Mangalorean chicken cooked with roasted spices and ghee.",
        category: "Main Course",
        price: 390,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[21].id,
      },

      // =====================================================
      // 22 - Rice & Spice
      // =====================================================

      {
        name: "Hyderabadi Chicken Biryani",
        description:
          "Aromatic basmati rice layered with spiced chicken and saffron.",
        category: "Biryani",
        price: 340,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: savedRestaurants[22].id,
      },

      {
        name: "Paneer Biryani",
        description:
          "Fragrant basmati rice cooked with paneer and Hyderabadi spices.",
        category: "Biryani",
        price: 280,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[22].id,
      },

      {
        name: "Double Ka Meetha",
        description:
          "Traditional Hyderabadi bread dessert topped with nuts.",
        category: "Desserts",
        price: 150,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[22].id,
      },

      // =====================================================
      // 23 - Garden Grains
      // =====================================================

      {
        name: "Organic Quinoa Bowl",
        description:
          "Organic quinoa served with fresh vegetables and herbs.",
        category: "Healthy Bowls",
        price: 310,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[23].id,
      },

      {
        name: "Millet Vegetable Bowl",
        description:
          "Nutritious millet cooked with seasonal vegetables and herbs.",
        category: "Healthy Bowls",
        price: 280,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[23].id,
      },

      {
        name: "Fresh Fruit Bowl",
        description:
          "Seasonal organic fruits served fresh.",
        category: "Fruits",
        price: 180,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: false,
        stockQuantity: undefined,
        restaurantId: savedRestaurants[23].id,
      },

      // =====================================================
      // 24 - Royal Tawa
      // =====================================================

      {
        name: "Paneer Tikka Masala",
        description:
          "Grilled paneer cooked in a rich spiced tomato gravy.",
        category: "Main Course",
        price: 290,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[24].id,
      },

      {
        name: "Amritsari Fish",
        description:
          "Crispy fish fillets coated with traditional Punjabi spices.",
        category: "Starters",
        price: 340,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[24].id,
      },

      {
        name: "Tawa Roti",
        description:
          "Fresh Indian flatbread cooked on a traditional tawa.",
        category: "Bread",
        price: 50,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 50,
        restaurantId: savedRestaurants[24].id,
      },

      // =====================================================
      // 25 - Little Tokyo
      // =====================================================

      {
        name: "Chicken Ramen",
        description:
          "Japanese ramen noodles served in a rich chicken broth.",
        category: "Japanese",
        price: 360,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: savedRestaurants[25].id,
      },

      {
        name: "Vegetable Sushi Roll",
        description:
          "Fresh sushi rolls filled with vegetables and seasoned rice.",
        category: "Sushi",
        price: 280,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: savedRestaurants[25].id,
      },

      {
        name: "Chicken Teriyaki",
        description:
          "Grilled chicken glazed with sweet and savory teriyaki sauce.",
        category: "Japanese",
        price: 390,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: savedRestaurants[25].id,
      },
    ];

    // =========================================================
    // SAVE MENU ITEMS
    // =========================================================

    const savedMenuItems =
      await menuItemRepository.save(menuItems);

    console.log(
      `Created ${savedMenuItems.length} menu items`
    );

    console.log(
      "Restaurant and menu seeding completed successfully"
    );
  } catch (error) {
    console.error(
      "Restaurant seeding failed:",
      error
    );

    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run:
// npx tsx src/config/seed.ts

seedRestaurants();