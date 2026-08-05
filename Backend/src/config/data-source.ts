import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import { User } from "../entity/user.entity.js";
import { Address } from "../entity/address.entity.js";
import { Cart } from "../entity/cart.entity.js";
import { CartItem } from "../entity/cartitem.entity.js";
import { Order } from "../entity/order.entity.js";
import { OrderItem } from "../entity/orderitem.entity.js";
import { MenuItem } from "../entity/menuitem.entity.js";
import { Restaurant } from "../entity/restaurant.entity.js";
import { Review } from "../entity/review.entity.js";
import { DeliveryTracking } from "../entity/deliverytracking.entity.js";
 
export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL!,
    synchronize: true,//only during development
    logging: false,
    entities:[User,Address,Cart,CartItem,Order,OrderItem,MenuItem,Restaurant,Review,DeliveryTracking]
});