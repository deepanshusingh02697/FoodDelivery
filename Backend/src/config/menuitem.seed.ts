import { AppDataSource } from "../config/data-source.js";
import { MenuItem } from "../entity/menuitem.entity.js";
import { Restaurant } from "../entity/restaurant.entity.js";

async function seedMenuItems() {
  try {
    await AppDataSource.initialize();

    console.log("Database connected");

    const restaurantRepository = AppDataSource.getRepository(Restaurant);

    const menuItemRepository = AppDataSource.getRepository(MenuItem);

    // Get restaurants that are ALREADY seeded
    const restaurants = await restaurantRepository.find();

    if (restaurants.length === 0) {
      throw new Error("No restaurants found. Seed restaurants first.");
    }

    console.log(`Found ${restaurants.length} restaurants`);

    /*
     * Find restaurant by name.
     * This prevents depending on hard-coded IDs such as 1, 2, 3...
     */
    const getRestaurantId = (name: string): number => {
      const restaurant = restaurants.find(
        (item) => item.restaurantName === name,
      );

      if (!restaurant) {
        throw new Error(`Restaurant "${name}" not found`);
      }

      return restaurant.id;
    };

    const image1 =
      "https://res.cloudinary.com/delubzbh2/image/upload/v1785686448/FoodDelivery/rvukbucw85v5jb0kupa2.avif";

    const image2 =
      "https://res.cloudinary.com/delubzbh2/image/upload/v1785686739/FoodDelivery/bezq1ayvc4zfmb6reih9.jpg";

    const menuItems: Partial<MenuItem>[] = [
      // =========================
      // Spice Garden
      // =========================
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
        restaurantId: getRestaurantId("Spice Garden"),
      },
      {
        name: "Paneer Tikka",
        description: "Grilled cottage cheese marinated with Indian spices.",
        category: "Starters",
        price: 240,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: getRestaurantId("Spice Garden"),
      },
      {
        name: "Garlic Naan",
        description: "Soft naan topped with garlic and coriander.",
        category: "Bread",
        price: 80,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: false,
        stockQuantity: undefined,
        restaurantId: getRestaurantId("Spice Garden"),
      },

      // =========================
      // Pizza Palace
      // =========================
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
        restaurantId: getRestaurantId("Pizza Palace"),
      },
      {
        name: "Chicken Pepperoni Pizza",
        description: "Cheesy pizza topped with chicken pepperoni and herbs.",
        category: "Pizza",
        price: 390,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: getRestaurantId("Pizza Palace"),
      },
      {
        name: "Penne Alfredo",
        description: "Penne pasta tossed in creamy Alfredo sauce.",
        category: "Pasta",
        price: 310,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: false,
        stockQuantity: undefined,
        restaurantId: getRestaurantId("Pizza Palace"),
      },

      // =========================
      // Burger House
      // =========================
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
        restaurantId: getRestaurantId("Burger House"),
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
        restaurantId: getRestaurantId("Burger House"),
      },
      {
        name: "Loaded French Fries",
        description: "Crispy fries topped with cheese and special seasoning.",
        category: "Sides",
        price: 150,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: false,
        stockQuantity: undefined,
        restaurantId: getRestaurantId("Burger House"),
      },

      // =========================
      // Fresh Bites
      // =========================
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
        restaurantId: getRestaurantId("Fresh Bites"),
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
        restaurantId: getRestaurantId("Fresh Bites"),
      },
      {
        name: "Fruit & Yogurt Bowl",
        description: "Fresh seasonal fruits with creamy yogurt and granola.",
        category: "Breakfast",
        price: 210,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 12,
        restaurantId: getRestaurantId("Fresh Bites"),
      },

      // =========================
      // Tandoori Hub
      // =========================
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
        restaurantId: getRestaurantId("Tandoori Hub"),
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
        restaurantId: getRestaurantId("Tandoori Hub"),
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
        restaurantId: getRestaurantId("Tandoori Hub"),
      },

      // =========================
      // South Spice
      // =========================
      {
        name: "Masala Dosa",
        description: "Crispy dosa filled with spiced potato masala.",
        category: "South Indian",
        price: 120,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 40,
        restaurantId: getRestaurantId("South Spice"),
      },
      {
        name: "Idli Sambar",
        description: "Soft steamed idlis served with hot sambar and chutney.",
        category: "South Indian",
        price: 100,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 35,
        restaurantId: getRestaurantId("South Spice"),
      },
      {
        name: "Medu Vada",
        description: "Crispy South Indian lentil fritters served with sambar.",
        category: "South Indian",
        price: 110,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: getRestaurantId("South Spice"),
      },

      // =========================
      // Saffron Leaf
      // =========================
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
        restaurantId: getRestaurantId("Saffron Leaf"),
      },
      {
        name: "Laal Maas",
        description: "Spicy Rajasthani mutton curry cooked with red chillies.",
        category: "Main Course",
        price: 420,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: getRestaurantId("Saffron Leaf"),
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
        restaurantId: getRestaurantId("Saffron Leaf"),
      },

      // =========================
      // Urban Tiffin Co
      // =========================
      {
        name: "Paneer Butter Masala",
        description: "Soft paneer cooked in a rich buttery tomato gravy.",
        category: "Main Course",
        price: 260,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: getRestaurantId("Urban Tiffin Co"),
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
        restaurantId: getRestaurantId("Urban Tiffin Co"),
      },
      {
        name: "Chole Bhature",
        description: "Spicy chickpea curry served with fluffy fried bhature.",
        category: "North Indian",
        price: 180,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 30,
        restaurantId: getRestaurantId("Urban Tiffin Co"),
      },

      // =========================
      // Olive Terrace
      // =========================
      {
        name: "Greek Salad",
        description: "Fresh cucumber, tomato, olives, feta cheese and herbs.",
        category: "Salads",
        price: 290,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: getRestaurantId("Olive Terrace"),
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
        stockQuantity: undefined,
        restaurantId: getRestaurantId("Olive Terrace"),
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
        restaurantId: getRestaurantId("Olive Terrace"),
      },

      // =========================
      // Wok & Flame
      // =========================
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
        restaurantId: getRestaurantId("Wok & Flame"),
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
        restaurantId: getRestaurantId("Wok & Flame"),
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
        restaurantId: getRestaurantId("Wok & Flame"),
      },

      // =========================
      // Basil & Bean
      // =========================
      {
        name: "Creamy Mushroom Pasta",
        description: "Italian pasta cooked with mushrooms in a creamy sauce.",
        category: "Pasta",
        price: 330,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: getRestaurantId("Basil & Bean"),
      },
      {
        name: "Grilled Chicken Steak",
        description: "Juicy grilled chicken steak served with vegetables.",
        category: "Main Course",
        price: 420,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: getRestaurantId("Basil & Bean"),
      },
      {
        name: "Classic Pancakes",
        description: "Fluffy pancakes served with butter and maple syrup.",
        category: "Breakfast",
        price: 220,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Basil & Bean"),
      },

      // =========================
      // Charcoal Junction
      // =========================
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
        restaurantId: getRestaurantId("Charcoal Junction"),
      },
      {
        name: "Grilled Paneer Skewers",
        description: "Paneer and vegetables grilled over charcoal.",
        category: "Grill",
        price: 280,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Charcoal Junction"),
      },
      {
        name: "Smoky BBQ Chicken",
        description: "Tender chicken coated with smoky barbecue sauce.",
        category: "Barbecue",
        price: 380,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: getRestaurantId("Charcoal Junction"),
      },

      // =========================
      // Namma Oota
      // =========================
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
        restaurantId: getRestaurantId("Namma Oota"),
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
        restaurantId: getRestaurantId("Namma Oota"),
      },
      {
        name: "Mangalore Bun",
        description: "Soft and slightly sweet fried bread served with chutney.",
        category: "Snacks",
        price: 100,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 35,
        restaurantId: getRestaurantId("Namma Oota"),
      },

      // =========================
      // Citrus Table
      // =========================
      {
        name: "Creamy Risotto",
        description: "Italian-style creamy risotto with herbs and parmesan.",
        category: "Italian",
        price: 380,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: getRestaurantId("Citrus Table"),
      },
      {
        name: "Herb Roasted Chicken",
        description: "Roasted chicken seasoned with fresh European herbs.",
        category: "Main Course",
        price: 450,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 12,
        restaurantId: getRestaurantId("Citrus Table"),
      },
      {
        name: "Chocolate Mousse",
        description: "Rich and smooth chocolate mousse served chilled.",
        category: "Desserts",
        price: 180,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Citrus Table"),
      },

      // =========================
      // Mango Chilli
      // =========================
      {
        name: "Thai Green Curry",
        description: "Creamy Thai curry with vegetables and aromatic herbs.",
        category: "Thai",
        price: 320,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Mango Chilli"),
      },
      {
        name: "Thai Basil Chicken",
        description: "Chicken stir-fried with Thai basil and aromatic spices.",
        category: "Thai",
        price: 350,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: getRestaurantId("Mango Chilli"),
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
        restaurantId: getRestaurantId("Mango Chilli"),
      },

      // =========================
      // The Curry Room
      // =========================
      {
        name: "Butter Naan",
        description: "Soft tandoori naan brushed with butter.",
        category: "Bread",
        price: 70,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 40,
        restaurantId: getRestaurantId("The Curry Room"),
      },
      {
        name: "Mutton Rogan Josh",
        description: "Slow-cooked mutton in a rich Kashmiri-style gravy.",
        category: "Main Course",
        price: 420,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: getRestaurantId("The Curry Room"),
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
        restaurantId: getRestaurantId("The Curry Room"),
      },

      // =========================
      // Firestone Kitchen
      // =========================
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
        restaurantId: getRestaurantId("Firestone Kitchen"),
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
        restaurantId: getRestaurantId("Firestone Kitchen"),
      },
      {
        name: "Grilled Corn",
        description: "Char-grilled corn seasoned with butter and spices.",
        category: "Sides",
        price: 120,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 25,
        restaurantId: getRestaurantId("Firestone Kitchen"),
      },

      // =========================
      // Harvest Bowl
      // =========================
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
        restaurantId: getRestaurantId("Harvest Bowl"),
      },
      {
        name: "Tofu Teriyaki Bowl",
        description: "Grilled tofu with vegetables, rice and teriyaki sauce.",
        category: "Vegan",
        price: 300,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Harvest Bowl"),
      },
      {
        name: "Avocado Toast",
        description: "Toasted bread topped with creamy avocado and herbs.",
        category: "Breakfast",
        price: 220,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 15,
        restaurantId: getRestaurantId("Harvest Bowl"),
      },

      // =========================
      // Bamboo Garden
      // =========================
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
        restaurantId: getRestaurantId("Bamboo Garden"),
      },
      {
        name: "Chicken Manchow Soup",
        description: "Spicy chicken soup topped with crispy noodles.",
        category: "Soups",
        price: 180,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Bamboo Garden"),
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
        restaurantId: getRestaurantId("Bamboo Garden"),
      },

      // =========================
      // Kebab Junction
      // =========================
      {
        name: "Mutton Seekh Kebab",
        description: "Juicy minced mutton kebabs seasoned with Mughlai spices.",
        category: "Kebabs",
        price: 380,
        isVeg: false,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 18,
        restaurantId: getRestaurantId("Kebab Junction"),
      },
      {
        name: "Chicken Shami Kebab",
        description: "Soft minced chicken kebabs with aromatic spices.",
        category: "Kebabs",
        price: 300,
        isVeg: false,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Kebab Junction"),
      },
      {
        name: "Mughlai Paneer",
        description: "Paneer cooked in a rich Mughlai-style creamy gravy.",
        category: "Main Course",
        price: 280,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Kebab Junction"),
      },

      // =========================
      // Morning Brew
      // =========================
      {
        name: "Cappuccino",
        description: "Classic espresso coffee topped with steamed milk foam.",
        category: "Coffee",
        price: 150,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 40,
        restaurantId: getRestaurantId("Morning Brew"),
      },
      {
        name: "Cold Coffee",
        description: "Chilled creamy coffee blended with milk and ice.",
        category: "Beverages",
        price: 180,
        isVeg: true,
        imageUrl: image2,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 35,
        restaurantId: getRestaurantId("Morning Brew"),
      },
      {
        name: "Chocolate Brownie",
        description: "Warm and fudgy chocolate brownie.",
        category: "Desserts",
        price: 160,
        isVeg: true,
        imageUrl: image1,
        isAvailable: true,
        trackStock: true,
        stockQuantity: 20,
        restaurantId: getRestaurantId("Morning Brew"),
      },
    ];

    const savedMenuItems = await menuItemRepository.save(menuItems);

    console.log(`Created ${savedMenuItems.length} menu items`);

    console.log("Menu item seeding completed successfully");
  } catch (error) {
    console.error("Menu item seeding failed:", error);

    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}
// npx tsx src/config/menuitem.seed.ts
seedMenuItems();
