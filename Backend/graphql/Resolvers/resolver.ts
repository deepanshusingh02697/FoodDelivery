import bcrypt from "bcryptjs";
import { accessCookieOptions, setToken } from "../../utils/jwt.cookie.js";
import { Context, isAdmin, isAuth, isOwner } from "../../src/middleware/context.js";
import {
  checkAddress,
  checkCategory,
  checkCuisine,
  checkDescription,
  checkemail,
  checkFirstName,
  checkFssaiNumber,
  checkGstNumber,
  checkImageUrl,
  checkLastName,
  checkName,
  checkPassword,
  checkPhone,
  checkPrice,
  checkRestaurantName,
} from "../../validation/validate.js";
import { razorpay } from "../../src/razorpay/Razorpay.js";
import crypto from "crypto";
import { GraphQLError } from "graphql";
import { authService } from "../../src/services/auth.service.js";
import {
  addressRepository,
  cartItemRepository,
  cartRepository,
  deliveryTrackingRepository,
  menuItemRepository,
  orderRepository,
  restaurantRepository,
  reviewRepository,
  userRepository,
} from "../../src/repositories/repository.js";
import {
  Restaurant,
  RestaurantStatus,
} from "../../src/entity/restaurant.entity.js";
import { AppDataSource } from "../../src/config/data-source.js";
import { Role, User } from "../../src/entity/user.entity.js";
import { Order, OrderStatus } from "../../src/entity/order.entity.js";
import { MenuItem } from "../../src/entity/menuitem.entity.js";
import { OrderItem } from "../../src/entity/orderitem.entity.js";
import { Cart } from "../../src/entity/cart.entity.js";
import { CartItem } from "../../src/entity/cartitem.entity.js";

export const resolvers = {
  Query: {
    GetCurrentUser: async (_parent: unknown, _args: unknown, ctx: Context) => {
      isAuth(ctx);
      return await userRepository.findOne({
        where: {
          id: ctx.userId!,
        },
      });
    },
    //admin
    GetPendingRestaurants: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context,
    ) => {
      isAdmin(ctx);
      return await restaurantRepository.find({
        where: {
          status: RestaurantStatus.PENDING,
        },
        relations: {
          owner: true,
          admin: true,
        },
      });
    },
    GetAdminDahsboard: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context,
    ) => {
      isAdmin(ctx);

      const [orders, approvedRestaurants, customers, pendingRestaurants] =
        await Promise.all([
          orderRepository.find(),
          restaurantRepository.count({
            where: {
              status: RestaurantStatus.APPROVED,
            },
          }),
          userRepository.count({
            where: {
              role: Role.CUSTOMER,
            },
          }),
          restaurantRepository.count({
            where: {
              status: RestaurantStatus.PENDING,
            },
          }),
        ]);

      let totalRevenue = 0;

      const ordersByStatus: Record<string, number> = {};

      for (const order of orders) {
        if (order.status !== OrderStatus.CANCELED) {
          totalRevenue += order.totalAmount;
        }

        ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
      }
      const orderStatusArray = [];

      for (const status in ordersByStatus) {
        orderStatusArray.push({
          status: status,
          count: ordersByStatus[status],
        });
      }

      return {
        totalRevenue,
        totalOrders: orders.length,
        totalRestaurants: approvedRestaurants,
        totalCustomers: customers,
        pendingRestaurants,
        ordersByStatus: orderStatusArray,
      };
    },
    //owner
    MyRestaurantMenu: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context,
    ) => {
      isOwner(ctx);

      const restaurant = await restaurantRepository.findOne({
        where: {
          ownerId: ctx.userId!,
        },
      });

      if (!restaurant) {
        throw new Error("No restaurant found for this owner");
      }

      const menuItems = await menuItemRepository.find({
        where: {
          restaurantId: restaurant.id,
        },
      });

      return menuItems;
    },
    RestaurantOrders: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context,
    ) => {
      isOwner(ctx);

      const restaurant = await restaurantRepository.findOne({
        where: {
          ownerId: ctx.userId!,
        },
      });

      if (!restaurant) {
        throw new Error("No restaurant found for this owner");
      }

      return await orderRepository.find({
        where: {
          restaurantId: restaurant.id,
        },
        relations: {
          items: true,
          user: true,
        },
        order: {
          placedAt: "DESC",
        },
      });
    },

    //customer
    MyOrders: async (_parent: unknown, _args: unknown, ctx: Context) => {
      isAuth(ctx);

      return await orderRepository.find({
        where: {
          userId: ctx.userId!,
        },
        relations: {
          items: true,
          restaurant: true,
        },
        order: {
          placedAt: "DESC",
        },
      });
    },
    GetRestaurants: async (_parent: unknown, _args: unknown, ctx: Context) => {
      return await restaurantRepository.find({
        where: {
          status: RestaurantStatus.APPROVED,
        },
        relations: {
          menus: true,
          reviews: true,
        },
      });
    },
    FilterRestaurants: async (
      _parent: unknown,
      args: {
        search?: string;
        cuisine?: string;
        vegOnly?: boolean;
        rating?: number;
      },
      ctx: Context,
    ) => {
      isAuth(ctx);

      let restaurants = await restaurantRepository.find({
        where: {
          status: RestaurantStatus.APPROVED,
        },
        relations: {
          menus: true,
          reviews: true,
        },
      });

      if (args.search) {
        restaurants = restaurants.filter((restaurant) =>
          restaurant.restaurantName
            .toLowerCase()
            .includes(args.search!.toLowerCase()),
        );
      }

      if (args.cuisine) {
        restaurants = restaurants.filter((restaurant) =>
          restaurant.cuisine
            .toLowerCase()
            .includes(args.cuisine!.toLowerCase()),
        );
      }

      if (args.vegOnly) {
        restaurants = restaurants.filter((restaurant) =>
          restaurant.menus.some((menu) => menu.isVeg && menu.isAvailable),
        );
      }

      if (args.rating !== undefined) {
        restaurants = restaurants.filter((restaurant) => {
          if (restaurant.reviews.length === 0) {
            return false;
          }

          let totalRating = 0;

          for (const review of restaurant.reviews) {
            totalRating += review.rating;
          }

          const averageRating = totalRating / restaurant.reviews.length;

          return averageRating >= args.rating!;
        });
      }

      return restaurants;
    },
    GetMenuItems: async (
      _parent: unknown,
      args: { restaurantID: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      return await menuItemRepository.find({
        where: {
          restaurantId: args.restaurantID,
        },
      });
    },
    GetCart: async (
      _parent: unknown,
      args: { restaurantId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const cart = await cartRepository.findOne({
        where: {
          userId: ctx.userId!,
          restaurantId: Number(args.restaurantId),
        },
        relations: {
          items: {
            menuItem: true,
          },
          restaurant: true,
        },
      });

      return cart;
    },
    AvailableDeliveryPartners: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context,
    ) => {
      isOwner(ctx);

      return await userRepository.find({
        where: {
          role: Role.DELIVERY_PARTNER,
        },
      });
    },
    MyAddresses: async (_parent: unknown, _args: unknown, ctx: Context) => {
      isAuth(ctx);

      return await addressRepository.find({
        where: {
          userId: ctx.userId!,
        },
        order: {
          isDefault: "DESC",
          createdAt: "DESC",
        },
      });
    },
    GetRestaurantReviews: async (
      _parent: unknown,
      args: { restaurantId: number },
      ctx: Context,
    ) => {
      return await reviewRepository.find({
        where: {
          restaurantId: Number(args.restaurantId),
        },
        relations: {
          user: true,
        },
        order: {
          createdAt: "DESC",
        },
      });
    },
    GetReaturantDetail: async (
      _parent: unknown,
      args: { restaurantId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      console.log(ctx.role, ctx.userId);

      return await restaurantRepository.findOne({
        where: {
          id: args.restaurantId,
        },
        relations: {
          reviews: true,
        },
      });
    },
  },

  Mutation: {
    SignUp: async (
      _parent: unknown,
      args: {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        phone: string;
      },
      _ctx: unknown,
    ) => {
      checkFirstName(args.firstname);
      checkLastName(args.lastname);
      checkemail(args.email);
      checkPassword(args.password);

      const user = await authService.signUp(args);

      return { success: true, msg: "user signup successfully", user };
    },

    LogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      checkemail(args.email);
      checkPassword(args.password);

      const user = await authService.login(args);
      setToken(ctx.res, user.id, user.role);

      return { success: true, msg: "Login successfully", user };
    },
    OwnerLogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      checkemail(args.email);
      checkPassword(args.password);

      const owner = await authService.ownerLogin(args);

      setToken(ctx.res, owner.id, owner.role);

      const { password, ...safeUser } = owner;
      return {
        success: true,
        msg: "login successfully as owner",
        user: safeUser,
      };
    },
    AdminLogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      checkemail(args.email);
      checkPassword(args.password);
      if (!args.password.trim()) {
        throw new GraphQLError("Password is required", {
          extensions: {
            code: "Bad Input",
            field: "password",
          },
        });
      }

      const admin = await authService.adminLogin(args);
      setToken(ctx.res, admin.id, admin.role);

      const { password, ...safeUser } = admin;
      return {
        success: true,
        msg: "login successfully as admin",
        user: safeUser,
      };
    },
    DeliveryPartnerSignUp: async (
      _parent: unknown,
      args: {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        phone: string;
      },
      _ctx: unknown,
    ) => {
      const user = await authService.deliveryPartnerSignUp(args);

      return {
        success: true,
        msg: "Delivery partner account created",
        user,
      };
    },
    DeliveryPartnerLogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      checkemail(args.email);
      checkPassword(args.password);
      const partner = await authService.partnerLogin(args);

      setToken(ctx.res, partner.id, partner.role);

      const { password, ...safeUser } = partner;
      return {
        success: true,
        msg: "login successfully as delivery partner",
        user: safeUser,
      };
    },

    LogOut: (_parent: unknown, args: unknown, ctx: Context) => {
      if (!ctx.userId) {
        throw new Error("You are not authenticated to logout");
      }
      ctx.res.clearCookie("accessToken", accessCookieOptions);
      return { success: true, msg: "You loged out successfully" };
    },

    //Owner
    RegisterRestaurantOwner: async (
      _parent: unknown,
      args: {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        phone: string;
        restaurantName: string;
        cuisine: string;
        address: string;
        fssaiNumber?: string;
        gstNumber?: string;
      },
      _ctx: unknown,
    ) => {
      checkFirstName(args.firstname);
      checkLastName(args.lastname);
      checkemail(args.email);
      checkPhone(args.phone);
      checkPassword(args.password);
      checkRestaurantName(args.restaurantName);
      checkCuisine(args.cuisine);
      checkAddress(args.address);
      checkFssaiNumber(args.fssaiNumber);
      checkGstNumber(args.gstNumber);

      const existUser = await userRepository.findOneBy({ email: args.email });
      if (existUser) {
        throw new Error("An account already exists with this email");
      }
      let existingRestaurant = null;
      if (args.fssaiNumber?.trim()) {
        existingRestaurant = await restaurantRepository.findOneBy({
          fssaiNumber: args.fssaiNumber.trim(),
        });
      }
      if (!existingRestaurant && args.gstNumber?.trim()) {
        existingRestaurant = await restaurantRepository.findOneBy({
          gstNumber: args.gstNumber.trim(),
        });
      }

      if (existingRestaurant) {
        switch (existingRestaurant.status) {
          case RestaurantStatus.PENDING:
            throw new Error(
              "This restaurant application is already under review.",
            );

          case RestaurantStatus.APPROVED:
            throw new Error("This restaurant is already registered.");

          case RestaurantStatus.REJECTED:
            throw new Error(
              "This restaurant application was rejected and cannot be submitted again.",
            );
        }
      }

      const hashPassword = await bcrypt.hash(args.password, 10);

      const result = await AppDataSource.transaction(async (tx) => {
        const user = tx.create(User, {
          firstname: args.firstname,
          lastname: args.lastname,
          email: args.email,
          password: hashPassword,
          phone: args.phone,
        });
        await tx.save(user);

        const restaurant = tx.create(Restaurant, {
          restaurantName: args.restaurantName,
          cuisine: args.cuisine,
          address: args.address,
          phone: args.phone,
          fssaiNumber: args.fssaiNumber,
          gstNumber: args.gstNumber,
          ownerId: user.id,
          status: RestaurantStatus.PENDING,
        });
        await tx.save(restaurant);

        return { user, restaurant };
      });
      return {
        success: true,
        msg: "Account created and submitted — you'll be notified once reviewed",
        restaurant: result.restaurant,
      };
    },

    CreateMenuItem: async (
      _parent: unknown,
      args: {
        name: string;
        description?: string;
        price: number;
        category: string;
        isVeg: boolean;
        imageUrl?: string;
        trackStock?: boolean;
        stockQuantity?: number;
      },
      ctx: Context,
    ) => {
      isOwner(ctx);
      checkName(args.name);
      checkDescription(args.description);
      checkPrice(args.price);
      checkCategory(args.category);
      checkImageUrl(args.imageUrl);

      const restaurant = await restaurantRepository.findOneBy({
        ownerId: ctx.userId!,
        status: RestaurantStatus.APPROVED,
      });

      if (!restaurant)
        throw new Error("No approved restaurant found for this owner");

      if (
        args.trackStock &&
        (args.stockQuantity === undefined || args.stockQuantity === null)
      ) {
        throw new Error("stockQuantity is required when trackStock is enabled");
      }

      const newmenu = await menuItemRepository.create({
        name: args.name,
        description: args.description?.trim(),
        price: Math.round(args.price * 100) / 100,
        category: args.category,
        isVeg: args.isVeg,
        imageUrl: args.imageUrl,
        trackStock: args.trackStock ?? false,
        stockQuantity: args.trackStock ? args.stockQuantity : undefined,
        restaurantId: restaurant.id,
      });
      await menuItemRepository.save(newmenu);

      const menu = await menuItemRepository.findOne({
        where: { id: newmenu.id },
        relations: { restaurant: true },
      });

      return { success: true, msg: "Menu item created", menuItem: menu };
    },
    UpdateMenuItem: async (
      _parent: unknown,
      args: {
        menuItemId: number;
        name?: string;
        description?: string;
        price?: number;
        category?: string;
        isVeg?: boolean;
        imageUrl?: string;
      },
      ctx: Context,
    ) => {
      isOwner(ctx);

      const menuItem = await menuItemRepository.findOne({
        where: { id: Number(args.menuItemId) },
        relations: { restaurant: true },
      });
      if (!menuItem) throw new Error("NOT_FOUND");
      if (menuItem.restaurant.ownerId !== ctx.userId) {
        throw new Error("You don't own this restaurant's menu");
      }

      await menuItemRepository.update(
        { id: menuItem.id },
        {
          name: args.name,
          description: args.description,
          price:
            args.price !== undefined
              ? Math.round(args.price * 100) / 100
              : undefined,
          category: args.category,
          isVeg: args.isVeg,
          imageUrl: args.imageUrl,
        },
      );
      const updated = await menuItemRepository.findOne({
        where: { id: menuItem.id },
      });

      return { success: true, msg: "Menu item updated", menuItem: updated };
    },

    ToggleMenuItemAvailability: async (
      _parent: unknown,
      args: { menuItemId: number },
      ctx: Context,
    ) => {
      isOwner(ctx);

      const menuItem = await menuItemRepository.findOne({
        where: { id: Number(args.menuItemId) },
        relations: {
          restaurant: true,
        },
      });
      if (!menuItem) throw new Error("NOT_FOUND");
      if (menuItem.restaurant.ownerId !== ctx.userId) {
        throw new Error("You don't own this restaurant's menu");
      }
      menuItem.isAvailable = !menuItem.isAvailable;
      const updated = await menuItemRepository.save(menuItem);

      return { success: true, msg: "Availability updated", menuItem: updated };
    },

    UpdateStock: async (
      _parent: unknown,
      args: { menuItemId: number; stockQuantity: number },
      ctx: Context,
    ) => {
      isOwner(ctx);

      const menuItem = await menuItemRepository.findOne({
        where: {
          id: args.menuItemId,
        },
        relations: {
          restaurant: true,
        },
      });

      if (!menuItem) {
        throw new Error("NOT_FOUND");
      }

      if (menuItem.restaurant.ownerId !== ctx.userId) {
        throw new Error("You don't own this restaurant's menu");
      }

      if (!menuItem.trackStock) {
        throw new Error("Enable stock tracking on this item first");
      }

      menuItem.stockQuantity = args.stockQuantity;

      await menuItemRepository.save(menuItem);

      return {
        success: true,
        msg: "Stock updated",
        menuItem,
      };
    },

    DeleteMenuItem: async (
      _parent: unknown,
      args: { menuItemId: number },
      ctx: Context,
    ) => {
      isOwner(ctx);

      const menuItem = await menuItemRepository.findOne({
        where: {
          id: Number(args.menuItemId),
        },
        relations: {
          restaurant: true,
        },
      });

      if (!menuItem) throw new Error("NOT_FOUND");
      if (menuItem.restaurant.ownerId !== ctx.userId) {
        throw new Error("You don't own this restaurant's menu");
      }

      await menuItemRepository.remove(menuItem);

      return { success: true, msg: "Menu item deleted", menuItem: null };
    },

    UpdateOrderStatus: async (
      _parent: unknown,
      args: {
        orderId: number;
        status: OrderStatus;
      },
      ctx: Context,
    ) => {
      const order = await orderRepository.findOne({
        where: {
          id: Number(args.orderId),
        },
        relations: {
          restaurant: true,
        },
      });

      if (!order) throw new Error("Order not found");

      switch (ctx.role) {
        case "OWNER":
          if (order.restaurant.ownerId !== ctx.userId) {
            throw new Error("Not your restaurant's order");
          }

          if (
            !["PLACED", "PREPARING"].includes(order.status) ||
            !["PREPARING", "CANCELED"].includes(args.status)
          ) {
            throw new Error("Invalid status update");
          }
          break;

        case "CUSTOMER":
          if (order.userId !== ctx.userId) {
            throw new Error("Not your order");
          }

          if (order.status !== "PLACED" || args.status !== "CANCELED") {
            throw new Error("You can only cancel a placed order");
          }
          break;

        case "DELIVERY_PARTNER":
          if (order.deliveryPartnerId !== ctx.userId) {
            throw new Error("Not assigned to you");
          }

          if (
            !["PREPARING", "OUT_FOR_DELIVERY"].includes(order.status) ||
            args.status !== "DELIVERED"
          ) {
            throw new Error("Invalid delivery status update");
          }
          break;

        default:
          throw new Error("Unauthorized");
      }

      order.status = args.status;

      const updated = await orderRepository.save(order);

      return {
        success: true,
        msg: "Order status updated",
        order: updated,
      };
    },
    AssignDeliveryPartner: async (
      _parent: unknown,
      args: { orderId: number; deliveryPartnerId: number },
      ctx: Context,
    ) => {
      isOwner(ctx);
      const order = await orderRepository.findOne({
        where: { id: Number(args.orderId) },
        relations: { restaurant: true },
      });
      if (!order) throw new Error("NOT_FOUND");
      if (order.restaurant.ownerId !== ctx.userId)
        throw new Error("Not your restaurant's order");
      if (order.status !== "PREPARING") {
        throw new Error(
          "Order must be PREPARING before assigning a delivery partner",
        );
      }

      const partner = await userRepository.findOne({
        where: { id: Number(args.deliveryPartnerId) },
      });

      if (!partner || partner.role !== "DELIVERY_PARTNER") {
        throw new Error("Invalid delivery partner");
      }

      order.deliveryPartnerId = partner.id;
      order.status = OrderStatus.OUT_FOR_DELIVERY;

      const updated = await orderRepository.save(order);

      return {
        success: true,
        msg: "Delivery partner assigned",
        order: updated,
      };
    },
    
    //Customer
    AddToCart: async (
      _parent: unknown,
      args: { menuItemId: number; quantity: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      if (args.quantity < 1) {
        throw new Error("Quantity must be greater than 0");
      }

      const menuItem = await menuItemRepository.findOne({
        where: {
          id: Number(args.menuItemId),
        },
      });

      if (!menuItem) {
        throw new Error("Menu item not found");
      }

      if (!menuItem.isAvailable) {
        throw new Error("This item is currently unavailable");
      }

      if (
        menuItem.trackStock &&
        (menuItem.stockQuantity ?? 0) < args.quantity
      ) {
        throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
      }

      let cart = await cartRepository.findOne({
        where: {
          userId: ctx.userId!,
          restaurantId: menuItem.restaurantId,
        },
      });

      if (!cart) {
        cart = cartRepository.create({
          userId: ctx.userId!,
          restaurantId: menuItem.restaurantId,
        });

        cart = await cartRepository.save(cart);
      }

      let cartItem = await cartItemRepository.findOne({
        where: {
          cartId: cart.id,
          menuItemId: menuItem.id,
        },
      });

      if (cartItem) {
        const newQuantity = cartItem.quantity + args.quantity;

        if (
          menuItem.trackStock &&
          (menuItem.stockQuantity ?? 0) < newQuantity
        ) {
          throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
        }

        cartItem.quantity = newQuantity;

        cartItem = await cartItemRepository.save(cartItem);
      } else {
        cartItem = cartItemRepository.create({
          cartId: cart.id,
          menuItemId: menuItem.id,
          quantity: args.quantity,
          priceAtAdd: menuItem.price,
        });

        cartItem = await cartItemRepository.save(cartItem);
      }

      const fullCart = await cartRepository.findOne({
        where: {
          id: cart.id,
        },
        relations: {
          items: {
            menuItem: true,
          },
        },
      });

      return {
        success: true,
        msg: "Added to cart",
        cart: fullCart,
      };
    },
    DecreaseCartItem: async (
      _parent: unknown,
      args: { cartItemId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const cartItem = await cartItemRepository.findOne({
        where: {
          id: Number(args.cartItemId),
        },
        relations: {
          cart: true,
        },
      });

      if (!cartItem) {
        throw new Error("NOT_FOUND");
      }

      if (cartItem.cart.userId !== ctx.userId) {
        throw new Error("Not your cart item");
      }

      if (cartItem.quantity <= 1) {
        await cartItemRepository.remove(cartItem);
      } else {
        cartItem.quantity = cartItem.quantity - 1;

        await cartItemRepository.save(cartItem);
      }

      const fullCart = await cartRepository.findOne({
        where: {
          id: cartItem.cartId,
        },
        relations: {
          items: {
            menuItem: true,
          },
        },
      });

      return {
        success: true,
        msg: "Quantity updated",
        cart: fullCart,
      };
    },
    RemoveFromCart: async (
      _parent: unknown,
      args: { cartItemId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const cartItem = await cartItemRepository.findOne({
        where: {
          id: Number(args.cartItemId),
        },
        relations: {
          cart: true,
        },
      });

      if (!cartItem) {
        throw new Error("NOT_FOUND");
      }

      if (cartItem.cart.userId !== ctx.userId) {
        throw new Error("Not your cart item");
      }

      await cartItemRepository.remove(cartItem);

      const fullCart = await cartRepository.findOne({
        where: {
          id: cartItem.cartId,
        },
        relations: {
          items: {
            menuItem: true,
          },
        },
      });

      return {
        success: true,
        msg: "Item removed",
        cart: fullCart,
      };
    },
    ClearCart: async (
      _parent: unknown,
      args: { cartId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const cart = await cartRepository.findOne({
        where: {
          id: Number(args.cartId),
        },
      });
      if (!cart) {
        throw new Error("Cart not found");
      }
      if (cart.userId !== ctx.userId) {
        throw new Error("this isn't your cart");
      }
      await cartItemRepository.delete({
        cartId: cart.id,
      });

      return {
        success: true,
        msg: "Cart cleared",
        cart: {
          ...cart,
          items: [],
        },
      };
    },

    AddAddress: async (
      _parent: unknown,
      args: {
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
        lat?: number;
        lng?: number;
        isDefault?: boolean;
      },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const address = addressRepository.create({
        userId: ctx.userId!,
        addressLine1: args.addressLine1,
        city: args.city,
        state: args.state,
        pincode: args.pincode,
        country: args.country ?? "India",
        lat: args.lat,
        lng: args.lng,
        isDefault: args.isDefault ?? false,
      });

      const savedAddress = await addressRepository.save(address);

      return {
        success: true,
        msg: "Address added",
        address: savedAddress,
      };
    },

    UpdateAddress: async (
      _parent: unknown,
      args: {
        addressId: number;
        addressLine1?: string;
        city?: string;
        state?: string;
        pincode?: string;
        lat?: number;
        lng?: number;
      },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const existing = await addressRepository.findOne({
        where: {
          id: Number(args.addressId),
        },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      if (existing.userId !== ctx.userId) {
        throw new Error("Not your address");
      }

      if (args.addressLine1 !== undefined) {
        existing.addressLine1 = args.addressLine1;
      }

      if (args.city !== undefined) {
        existing.city = args.city;
      }

      if (args.state !== undefined) {
        existing.state = args.state;
      }

      if (args.pincode !== undefined) {
        existing.pincode = args.pincode;
      }

      if (args.lat !== undefined) {
        existing.lat = args.lat;
      }

      if (args.lng !== undefined) {
        existing.lng = args.lng;
      }

      const updated = await addressRepository.save(existing);

      return {
        success: true,
        msg: "Address updated",
        address: updated,
      };
    },

    DeleteAddress: async (
      _parent: unknown,
      args: { addressId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const existing = await addressRepository.findOne({
        where: {
          id: Number(args.addressId),
        },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      if (existing.userId !== ctx.userId) {
        throw new Error("Not your address");
      }

      try {
        await addressRepository.remove(existing);
      } catch (err) {
        throw new Error(
          "can't delete this address because it linked with order",
        );
      }

      return {
        success: true,
        msg: "Address deleted",
        address: null,
      };
    },

    PlaceOrder: async (
      _parent: unknown,
      args: { cartId: number; addressId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const cart = await cartRepository.findOne({
        where: {
          id: Number(args.cartId),
        },
        relations: {
          items: {
            menuItem: true,
          },
        },
      });

      if (!cart) {
        throw new Error("NOT_FOUND");
      }

      if (cart.userId !== ctx.userId) {
        throw new Error("not your cart");
      }

      if (cart.items.length === 0) {
        throw new Error("cart is empty");
      }

      const address = await addressRepository.findOne({
        where: {
          id: Number(args.addressId),
        },
      });

      if (!address) {
        throw new Error("Address not found");
      }

      if (address.userId !== ctx.userId) {
        throw new Error("Not your address");
      }

      const addressSnapshot = [
        address.addressLine1,
        address.city,
        address.state,
        address.pincode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ");

      const queryRunner = AppDataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const menuItemRepository = queryRunner.manager.getRepository(MenuItem);

        const orderRepository = queryRunner.manager.getRepository(Order);

        const orderItemRepository =
          queryRunner.manager.getRepository(OrderItem);

        for (const item of cart.items) {
          if (item.menuItem.trackStock) {
            const result = await menuItemRepository
              .createQueryBuilder()
              .update(MenuItem)
              .set({
                stockQuantity: () => `"stockQuantity" - ${item.quantity}`,
              })
              .where("id = :id", {
                id: item.menuItemId,
              })
              .andWhere("stockQuantity >= :quantity", {
                quantity: item.quantity,
              })
              .execute();

            if (result.affected === 0) {
              throw new Error(
                `${item.menuItem.name} no longer has enough stock`,
              );
            }
          }
        }

        const subtotal = cart.items.reduce(
          (sum, item) => sum + item.priceAtAdd * item.quantity,
          0,
        );

        const deliveryFee = 49;

        const totalAmount = subtotal + deliveryFee;

        const order = orderRepository.create({
          userId: ctx.userId!,
          restaurantId: cart.restaurantId,
          deliveryAddressId: address.id,
          addressSnapshot,
          subtotal,
          deliveryFee,
          totalAmount,
        });

        const savedOrder = await orderRepository.save(order);

        const orderItems = cart.items.map((item) =>
          orderItemRepository.create({
            orderId: savedOrder.id,
            menuItemId: item.menuItemId,
            nameSnapshot: item.menuItem.name,
            priceSnapshot: item.priceAtAdd,
            quantity: item.quantity,
          }),
        );

        await orderItemRepository.save(orderItems);

        await queryRunner.commitTransaction();

        const fullOrder = await orderRepository.findOne({
          where: {
            id: savedOrder.id,
          },
          relations: {
            items: true,
          },
        });

        return {
          success: true,
          msg: "Order placed",
          order: fullOrder,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    },

    PayOrder: async (
      _parent: unknown,
      args: { orderId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const order = await orderRepository.findOne({
        where: {
          id: Number(args.orderId),
        },
      });

      if (!order) {
        throw new Error("NOT_FOUND");
      }

      if (order.userId !== ctx.userId) {
        throw new Error("Not your order");
      }

      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(order.totalAmount * 100), // Amount in paise
          currency: "INR",
          receipt: `order_${order.id}`,
        });

        return {
          success: true,
          msg: "Razorpay order created",
          razorpayOrder,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Error in Razorpay services");
      }
    },
    VerifyPayment: async (
      _parent: unknown,
      args: {
        orderId: number;
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
      },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const body = `${args.razorpayOrderId}|${args.razorpayPaymentId}`;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex");

      if (expectedSignature !== args.razorpaySignature) {
        throw new Error("Payment verification failed");
      }

      const queryRunner = AppDataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const orderRepository = queryRunner.manager.getRepository(Order);

        const cartRepository = queryRunner.manager.getRepository(Cart);

        const cartItemRepository = queryRunner.manager.getRepository(CartItem);

        const order = await orderRepository.findOne({
          where: {
            id: Number(args.orderId),
          },
        });

        if (!order) {
          throw new Error("NOT_FOUND");
        }

        if (order.userId !== ctx.userId) {
          throw new Error("This isn't your order");
        }

        order.status = OrderStatus.PREPARING;

        const updated = await orderRepository.save(order);

        const cart = await cartRepository.findOne({
          where: {
            userId: ctx.userId!,
          },
        });

        if (cart) {
          await cartItemRepository.delete({
            cartId: cart.id,
          });
        }

        await queryRunner.commitTransaction();

        return {
          success: true,
          msg: "Payment verified",
          order: updated,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    },

    //review
    SubmitReview: async (
      _parent: unknown,
      args: {
        restaurantId: number;
        rating: number;
        comment?: string;
      },
      ctx: Context,
    ) => {
      isAuth(ctx);

      if (args.rating < 1 || args.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      const restaurant = await restaurantRepository.findOne({
        where: {
          id: Number(args.restaurantId),
        },
      });

      if (!restaurant) {
        throw new Error("NOT_FOUND");
      }

      const existing = await reviewRepository.findOne({
        where: {
          userId: ctx.userId!,
          restaurantId: restaurant.id,
        },
      });

      if (existing) {
        throw new Error("You've already reviewed this restaurant");
      }

      const review = reviewRepository.create({
        rating: args.rating,
        comment: args.comment,
        userId: ctx.userId!,
        restaurantId: restaurant.id,
      });

      const savedReview = await reviewRepository.save(review);

      const fullReview = await reviewRepository.findOne({
        where: {
          id: savedReview.id,
        },
        relations: {
          user: true,
        },
      });

      return {
        success: true,
        msg: "Review submitted",
        review: fullReview,
      };
    },

    UpdateReview: async (
      _parent: unknown,
      args: {
        reviewId: number;
        rating?: number;
        comment?: string;
      },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const existing = await reviewRepository.findOne({
        where: {
          id: Number(args.reviewId),
        },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      if (existing.userId !== ctx.userId) {
        throw new Error("Not your review");
      }

      if (args.rating !== undefined && (args.rating < 1 || args.rating > 5)) {
        throw new Error("Rating must be between 1 and 5");
      }

      if (args.rating !== undefined) {
        existing.rating = args.rating;
      }

      if (args.comment !== undefined) {
        existing.comment = args.comment;
      }

      const savedReview = await reviewRepository.save(existing);

      const updated = await reviewRepository.findOne({
        where: {
          id: savedReview.id,
        },
        relations: {
          user: true,
        },
      });

      return {
        success: true,
        msg: "Review updated",
        review: updated,
      };
    },

    DeleteReview: async (
      _parent: unknown,
      args: { reviewId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const existing = await reviewRepository.findOne({
        where: {
          id: Number(args.reviewId),
        },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      if (existing.userId !== ctx.userId) {
        throw new Error("Not your review");
      }

      await reviewRepository.remove(existing);

      return {
        success: true,
        msg: "Review deleted",
        review: null,
      };
    },

    //admin
    ApproveRestaurant: async (
      _parent: unknown,
      args: { restaurantId: number },
      ctx: Context,
    ) => {
      isAdmin(ctx);

      const queryRunner = AppDataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const restaurantRepository =
          queryRunner.manager.getRepository(Restaurant);

        const userRepository = queryRunner.manager.getRepository(User);

        const restaurant = await restaurantRepository.findOne({
          where: {
            id: Number(args.restaurantId),
          },
        });

        if (!restaurant) {
          throw new Error("NOT_FOUND");
        }

        if (restaurant.status !== RestaurantStatus.PENDING) {
          throw new Error("Already processed!");
        }

        restaurant.status = RestaurantStatus.APPROVED;
        restaurant.approvedBy = ctx.userId!;
        restaurant.approvedAt = new Date();

        const updated = await restaurantRepository.save(restaurant);

        const owner = await userRepository.findOne({
          where: {
            id: restaurant.ownerId,
          },
        });

        if (!owner) {
          throw new Error("Restaurant owner not found");
        }

        owner.role = Role.OWNER;

        await userRepository.save(owner);

        await queryRunner.commitTransaction();

        return {
          success: true,
          msg: "Approved",
          restaurant: updated,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    },
    RejectRestaurant: async (
      _parent: unknown,
      args: { restaurantId: number },
      ctx: Context,
    ) => {
      isAdmin(ctx);

      const restaurant = await restaurantRepository.findOne({
        where: {
          id: Number(args.restaurantId),
        },
      });

      if (!restaurant) {
        throw new Error("NOT_FOUND");
      }

      if (restaurant.status !== RestaurantStatus.PENDING) {
        throw new Error("Already processed!");
      }

      restaurant.status = RestaurantStatus.REJECTED;
      restaurant.approvedBy = ctx.userId!;
      restaurant.approvedAt = new Date();

      const updated = await restaurantRepository.save(restaurant);

      return {
        success: true,
        msg: "Rejected",
        restaurant: updated,
      };
    },

    //Delivery_man
    UpdateDeliveryLocation: async (
      _parent: unknown,
      args: {
        orderId: number;
        lat: number;
        lng: number;
      },
      ctx: Context,
    ) => {
      if (ctx.role !== Role.DELIVERY_PARTNER) {
        throw new Error("Only delivery partners can update location");
      }

      const order = await orderRepository.findOne({
        where: {
          id: Number(args.orderId),
        },
      });

      if (!order) {
        throw new Error("NOT_FOUND");
      }

      if (order.deliveryPartnerId !== ctx.userId) {
        throw new Error("This order isn't assigned to you");
      }

      let tracking = await deliveryTrackingRepository.findOne({
        where: {
          orderId: order.id,
        },
      });

      if (tracking) {
        tracking.lat = args.lat;
        tracking.lng = args.lng;

        tracking = await deliveryTrackingRepository.save(tracking);
      } else {
        tracking = deliveryTrackingRepository.create({
          orderId: order.id,
          lat: args.lat,
          lng: args.lng,
        });

        tracking = await deliveryTrackingRepository.save(tracking);
      }

      return tracking;
    },
  },
};
