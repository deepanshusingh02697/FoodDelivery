import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import { User } from "../entity/User.entity.js";
import { Address } from "../entity/Address.entity.js";
import { Cart } from "../entity/Cart.entity.js";
import { CartItem } from "../entity/Cartitem.entity.js";
import { Order } from "../entity/Order.entity.js";
import { OrderItem } from "../entity/Orderitem.entity.js";
import { MenuItem } from "../entity/Menuitem.entity.js";
import { Restaurant } from "../entity/Restaurant.entity.js";
import { Review } from "../entity/Review.entity.js";
import { DeliveryTracking } from "../entity/Deliverytracking.entity.js";
 
export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL!,
    synchronize: true,//only during development
    logging: false,
    entities:[User,Address,Cart,CartItem,Order,OrderItem,MenuItem,Restaurant,Review,DeliveryTracking]
});