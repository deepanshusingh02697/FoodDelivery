import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { accessCookieOptions, setToken } from "../../lib/jwtCookie";
import { Context, isAdmin, isAuth, isOwner } from "../context";

export const resolvers = {
  Query: {
    GetCurrentUser: async (_parent: unknown, _args: unknown, ctx: Context) => {
      isAuth(ctx);
      const user = await prisma.user.findUnique({ where: { id: ctx.userId! } });
      return user;
    },

    //admin
    GetPendingRestaurants: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context,
    ) => {
      isAdmin(ctx);
      return await prisma.restaurant.findMany({
        where: { status: "PENDING" },
        include: {
          owner: true,
          admin: true,
        },
      });
    },

    //owner
    MyRestaurantMenu: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context,
    ) => {
      isOwner(ctx);
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: ctx.userId! },
      });
      if (!restaurant) throw new Error("No restaurant found for this owner");
      return await prisma.menuItem.findMany({
        where: { restaurantId: restaurant.id },
      });
    },
    RestaurantOrders: async (
      _parent: unknown,
      _args: unknown,
      ctx: Context,
    ) => {
      isOwner(ctx);
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: ctx.userId! },
      });
      if (!restaurant) throw new Error("No restaurant found for this owner");

      return await prisma.order.findMany({
        where: { restaurantId: restaurant.id },
        include: { items: true, user: true },
        orderBy: { placedAt: "desc" },
      });
    },

    //customer
    MyOrders: async (_parent: unknown, _args: unknown, ctx: Context) => {
      isAuth(ctx);
      return await prisma.order.findMany({
        where: { userId: ctx.userId! },
        include: { items: true, restaurant: true },
        orderBy: { placedAt: "desc" },
      });
    },
    GetRestaurants: async (_parent: unknown, _args: unknown, ctx: Context) => {
      return await prisma.restaurant.findMany({
        where: {
          status: "APPROVED",
        },
        include: {
          menus: true,
        },
        orderBy: {
          restaurantName: "asc",
        },
      });
    },
    FilterRestaurants: async (
      _parent: unknown,
      args: {
        search?: string;
        cuisine?: string;
        vegOnly?: boolean;
      },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const filterrestaurant = await prisma.restaurant.findMany({
        where: {
          status: "APPROVED",

          ...(args.search && {
            restaurantName: {
              contains: args.search,
              mode: "insensitive",
            },
          }),

          ...(args.cuisine && {
            cuisine: {
              contains: args.cuisine,
              mode: "insensitive",
            },
          }),
          ...(args.vegOnly && {
            menus: {
              some: {
                isVeg: true,
                isAvailable: true,
              },
            },
          }),
        },
        include: {
          menus: true,
        },
      });

      return filterrestaurant;
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
      console.log(args.firstname,args.lastname,args.email,args.password)
      const existUser = await prisma.user.findUnique({
        where: { email: args.email },
      });
      if (existUser) throw new Error("Email already exist");

      const hashPassword = await bcrypt.hash(args.password.trim(), 10);

      const user = await prisma.user.create({
        data: {
          firstname: args.firstname.trim(),
          lastname: args.lastname.trim(),
          email: args.email.toLowerCase().trim(),
          password: hashPassword,
        },
      });

      return { success: true, msg: "user signup successfully", user };
    },

    LogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      if (!args.email || !args.password) {
        throw new Error("All fields required");
      }
      const userExist = await prisma.user.findUnique({
        where: { email: args.email.toLowerCase().trim() },
        include: { restaurant: true, approved: true },
      });
      if (!userExist) throw new Error("Email does not exist");

      if (userExist.role !== "CUSTOMER") {
        throw new Error("Please use the owner or admin login");
      }
      const match = await bcrypt.compare(args.password, userExist.password);
      if (!match) throw new Error("Invalid credentials");

      setToken(ctx.res, userExist.id, userExist.role);

      return { success: true, msg: "Login successfully", user: userExist };
    },
    OwnerLogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      if (!args.email || !args.password)
        throw new Error("Email and password are required");

      const owner = await prisma.user.findUnique({
        where: { email: args.email.toLowerCase().trim() },
      });

      if (!owner) throw new Error("Invalid credentials");
      if (owner.role !== "OWNER")
        throw new Error("Invalid credentials to login as owner");

      const passwordMatch = await bcrypt.compare(args.password, owner.password);
      if (!passwordMatch)
        throw new Error("Invalid credentials to login as owner");

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
      if (!args.email || !args.password)
        throw new Error("Email and password are required");

      const admin = await prisma.user.findUnique({
        where: { email: args.email.toLowerCase().trim() },
      });
      if (!admin) throw new Error("Invalid credentials");
      if (admin.role !== "ADMIN")
        throw new Error("Invalid credentials to login as admin");

      const passwordMatch = await bcrypt.compare(args.password, admin.password);
      if (!passwordMatch)
        throw new Error("Invalid credentials to login as admin");

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
      const email = args.email.toLowerCase().trim();
      const existUser = await prisma.user.findUnique({ where: { email } });
      if (existUser) throw new Error("Email already exist");

      const hashPassword = await bcrypt.hash(args.password.trim(), 10);

      const user = await prisma.user.create({
        data: {
          firstname: args.firstname.trim(),
          lastname: args.lastname.trim(),
          email,
          password: hashPassword,
          phone: args.phone,
          role: "DELIVERY_PARTNER",
        },
      });

      return { success: true, msg: "Delivery partner account created", user };
    },
    DeliveryPartnerLogIn: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      if (!args.email || !args.password)
        throw new Error("Email and password are required");

      const partner = await prisma.user.findUnique({
        where: { email: args.email.toLowerCase().trim() },
      });
      if (!partner) throw new Error("Invalid credentials");
      if (partner.role !== "DELIVERY_PARTNER")
        throw new Error("Invalid credentials to login as delivery partner");

      const passwordMatch = await bcrypt.compare(
        args.password,
        partner.password,
      );
      if (!passwordMatch)
        throw new Error("Invalid credentials to login as delivery partner");

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
      const existUser = await prisma.user.findUnique({
        where: { email: args.email },
      });

      if (existUser) {
        throw new Error("An account already exists with this email");
      }
      const existingRestaurant = await prisma.restaurant.findFirst({
        where: {
          OR: [
            { fssaiNumber: args.fssaiNumber },
            { gstNumber: args.gstNumber },
          ],
        },
      });

      if (existingRestaurant) {
        switch (existingRestaurant.status) {
          case "PENDING":
            throw new Error(
              "This restaurant application is already under review.",
            );

          case "APPROVED":
            throw new Error("This restaurant is already registered.");

          case "REJECTED":
            throw new Error(
              "This restaurant application was rejected and cannot be submitted again.",
            );
        }
      }

      const hashPassword = await bcrypt.hash(args.password, 10);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            firstname: args.firstname,
            lastname: args.lastname,
            email: args.email,
            password: hashPassword,
            phone: args.phone,
          },
        });

        const restaurant = await tx.restaurant.create({
          data: {
            restaurantName: args.restaurantName,
            cuisine: args.cuisine,
            address: args.address,
            phone: args.phone,
            fssaiNumber: args.fssaiNumber,
            gstNumber: args.gstNumber,
            ownerId: user.id,
            status: "PENDING",
          },
        });

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

      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: ctx.userId!, status: "APPROVED" },
      });
      if (!restaurant)
        throw new Error("No approved restaurant found for this owner");

      if (
        args.trackStock &&
        (args.stockQuantity === undefined || args.stockQuantity === null)
      ) {
        throw new Error("stockQuantity is required when trackStock is enabled");
      }

      const menu = await prisma.menuItem.create({
        data: {
          name: args.name,
          description: args.description,
          price: Math.round(args.price * 100) / 100,
          category: args.category,
          isVeg: args.isVeg,
          imageUrl: args.imageUrl,
          trackStock: args.trackStock ?? false,
          stockQuantity: args.trackStock ? args.stockQuantity : null,
          restaurantId: restaurant.id,
        },
        include: {
          restaurant: true,
        },
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

      const menuItem = await prisma.menuItem.findUnique({
        where: { id: Number(args.menuItemId) },
        include: { restaurant: true },
      });
      if (!menuItem) throw new Error("NOT_FOUND");
      if (menuItem.restaurant.ownerId !== ctx.userId) {
        throw new Error("You don't own this restaurant's menu");
      }

      const updated = await prisma.menuItem.update({
        where: { id: menuItem.id },
        data: {
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
      });

      return { success: true, msg: "Menu item updated", menuItem: updated };
    },

    ToggleMenuItemAvailability: async (
      _parent: unknown,
      args: { menuItemId: number },
      ctx: Context,
    ) => {
      isOwner(ctx);

      const menuItem = await prisma.menuItem.findUnique({
        where: { id: Number(args.menuItemId) },
        include: { restaurant: true },
      });
      if (!menuItem) throw new Error("NOT_FOUND");
      if (menuItem.restaurant.ownerId !== ctx.userId) {
        throw new Error("You don't own this restaurant's menu");
      }

      const updated = await prisma.menuItem.update({
        where: { id: menuItem.id },
        data: { isAvailable: !menuItem.isAvailable },
      });

      return { success: true, msg: "Availability updated", menuItem: updated };
    },

    UpdateStock: async (
      _parent: unknown,
      args: { menuItemId: number; stockQuantity: number },
      ctx: Context,
    ) => {
      isOwner(ctx);

      const menuItem = await prisma.menuItem.findUnique({
        where: { id: Number(args.menuItemId) },
        include: { restaurant: true },
      });
      if (!menuItem) throw new Error("NOT_FOUND");
      if (menuItem.restaurant.ownerId !== ctx.userId) {
        throw new Error("You don't own this restaurant's menu");
      }
      if (!menuItem.trackStock) {
        throw new Error("Enable stock tracking on this item first");
      }

      const updated = await prisma.menuItem.update({
        where: { id: menuItem.id },
        data: { stockQuantity: args.stockQuantity },
      });

      return { success: true, msg: "Stock updated", menuItem: updated };
    },

    DeleteMenuItem: async (
      _parent: unknown,
      args: { menuItemId: number },
      ctx: Context,
    ) => {
      isOwner(ctx);

      const menuItem = await prisma.menuItem.findUnique({
        where: { id: Number(args.menuItemId) },
        include: { restaurant: true },
      });
      if (!menuItem) throw new Error("NOT_FOUND");
      if (menuItem.restaurant.ownerId !== ctx.userId) {
        throw new Error("You don't own this restaurant's menu");
      }

      await prisma.menuItem.delete({ where: { id: menuItem.id } });

      return { success: true, msg: "Menu item deleted", menuItem: null };
    },
    UpdateOrderStatus: async (
      _parent: unknown,
      args: { orderId: number; status: "PREPARING" | "CANCELED" },
      ctx: Context,
    ) => {
      isOwner(ctx);

      const order = await prisma.order.findUnique({
        where: { id: Number(args.orderId) },
        include: { restaurant: true },
      });
      if (!order) throw new Error("NOT_FOUND");
      if (order.restaurant.ownerId !== ctx.userId) {
        throw new Error("This isn't your restaurant's order");
      }
      if (order.status !== "PLACED" && order.status !== "PREPARING") {
        throw new Error(`Cannot update status once order is ${order.status}`);
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: args.status },
      });

      return { success: true, msg: "Order status updated", order: updated };
    },

    AssignDeliveryPartner: async (
      _parent: unknown,
      args: { orderId: number; deliveryPartnerId: number },
      ctx: Context,
    ) => {
      isOwner(ctx);
      const order = await prisma.order.findUnique({
        where: { id: Number(args.orderId) },
        include: { restaurant: true },
      });
      if (!order) throw new Error("NOT_FOUND");
      if (order.restaurant.ownerId !== ctx.userId)
        throw new Error("This isn't your restaurant's order");
      if (order.status !== "PREPARING") {
        throw new Error(
          "Order must be PREPARING before assigning a delivery partner",
        );
      }
      const partner = await prisma.user.findUnique({
        where: { id: Number(args.deliveryPartnerId) },
      });
      if (!partner || partner.role !== "DELIVERY_PARTNER") {
        throw new Error("Invalid delivery partner");
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          deliveryPartnerId: partner.id,
          status: "OUT_FOR_DELIVERY",
        },
      });

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
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: Number(args.menuItemId) },
      });
      if (!menuItem) throw new Error("Menu item not found");
      if (!menuItem.isAvailable)
        throw new Error("This item is currently unavailable");

      if (menuItem.trackStock) {
        if ((menuItem.stockQuantity ?? 0) < args.quantity) {
          throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
        }
      }
      const cart = await prisma.cart.upsert({
        where: {
          userId_restaurantId: {
            userId: ctx.userId!,
            restaurantId: menuItem.restaurantId,
          },
        },
        update: {},
        create: {
          userId: ctx.userId!,
          restaurantId: menuItem.restaurantId,
        },
      });
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, menuItemId: menuItem.id },
      });
      let cartItem;
      if (existingItem) {
        //if exist update it
        const newQuantity = existingItem.quantity + args.quantity;
        if (
          menuItem.trackStock &&
          (menuItem.stockQuantity ?? 0) < newQuantity
        ) {
          throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
        }
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        //item not exist, update it
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            menuItemId: menuItem.id,
            quantity: args.quantity,
            priceAtAdd: menuItem.price,
          },
        });
      }

      const fullCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { menuItem: true } } },
      });

      return { success: true, msg: "Added to cart", cart: fullCart };
    },
    RemoveFromCart: async (
      _parent: unknown,
      args: { cartItemId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: Number(args.cartItemId) },
        include: { cart: true },
      });
      if (!cartItem) throw new Error("NOT_FOUND");
      if (cartItem.cart.userId !== ctx.userId) {
        throw new Error("Not your cart item");
      }
      await prisma.cartItem.delete({ where: { id: cartItem.id } });
      const fullCart = await prisma.cart.findUnique({
        where: { id: cartItem.cartId },
        include: { items: { include: { menuItem: true } } },
      });
      return { success: true, msg: "Item removed", cart: fullCart };
    },
    ClearCart: async (
      _parent: unknown,
      args: { cartId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      const cart = await prisma.cart.findUnique({
        where: { id: Number(args.cartId) },
      });
      if (!cart) throw new Error("Cart not found");
      if (cart.userId !== ctx.userId) throw new Error("This isn't your cart"); // ← add this

      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      return {
        success: true,
        msg: "Cart cleared",
        cart: { ...cart, items: [] },
      };
    },
    PlaceOrder: async (
      _parent: unknown,
      args: { cartId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);

      const cart = await prisma.cart.findUnique({
        where: { id: Number(args.cartId) },
        include: { items: { include: { menuItem: true } } },
      });
      if (!cart) throw new Error("NOT_FOUND");
      if (cart.userId !== ctx.userId) throw new Error("This isn't your cart");
      if (cart.items.length === 0) throw new Error("Cart is empty");

      console.log("cart is : ", cart);

      const order = await prisma.$transaction(async (tx) => {
        for (const item of cart.items) {
          if (item.menuItem.trackStock) {
            const result = await tx.menuItem.updateMany({
              where: {
                id: item.menuItemId,
                stockQuantity: { gte: item.quantity },
              },
              data: { stockQuantity: { decrement: item.quantity } },
            });
            if (result.count === 0) {
              throw new Error(
                `${item.menuItem.name} no longer has enough stock`,
              );
            }
          }
        }

        const subtotal = cart.items.reduce(
          (sum, i) => sum + i.priceAtAdd * i.quantity,
          0,
        );
        const deliveryFee = 49;
        const totalAmount = subtotal + deliveryFee;

        const newOrder = await tx.order.create({
          data: {
            userId: ctx.userId!,
            restaurantId: cart.restaurantId,
            subtotal,
            deliveryFee,
            totalAmount,
            items: {
              create: cart.items.map((item) => ({
                menuItemId: item.menuItemId,
                nameSnapshot: item.menuItem.name,
                priceSnapshot: item.priceAtAdd,
                quantity: item.quantity,
              })),
            },
          },
          include: { items: true },
        });

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return newOrder;
      });

      return { success: true, msg: "Order placed", order };
    },

    //admin approve/reject restaurant
    ApproveRestaurant: async (
      _parent: unknown,
      args: { restaurantId: number },
      ctx: Context,
    ) => {
      isAdmin(ctx);

      const restaurant = await prisma.restaurant.findUnique({
        where: { id: Number(args.restaurantId) },
      });
      if (!restaurant) throw new Error("NOT_FOUND");
      if (restaurant.status !== "PENDING")
        throw new Error("Already processed!");

      const updated = await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          status: "APPROVED",
          approvedBy: ctx.userId!,
          approvedAt: new Date(),
        },
      });

      // promote the applicant to OWNER — this is the whole "become an owner" moment
      await prisma.user.update({
        where: { id: restaurant.ownerId },
        data: { role: "OWNER" },
      });

      return { success: true, msg: "Approved", restaurant: updated };
    },
    RejectRestaurant: async (
      _parent: unknown,
      args: { restaurantId: number },
      ctx: Context,
    ) => {
      isAdmin(ctx);

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: Number(args.restaurantId),
        },
      });

      if (!restaurant) throw new Error("NOT_FOUND");
      if (restaurant.status !== "PENDING")
        throw new Error("Already processed!");

      const updated = await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          status: "REJECTED",
          approvedBy: ctx.userId!, // admin who reviewed it, even though they rejected
          approvedAt: new Date(),
        },
      });

      return { success: true, msg: "Rejected", restaurant: updated };
    },

    //Delivery_man
    UpdateDeliveryLocation: async (
      _parent: unknown,
      args: { orderId: number; lat: number; lng: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      if (ctx.role !== "DELIVERY_PARTNER")
        throw new Error("Only delivery partners can update location");

      const order = await prisma.order.findUnique({
        where: { id: Number(args.orderId) },
      });
      if (!order) throw new Error("NOT_FOUND");
      if (order.deliveryPartnerId !== ctx.userId)
        throw new Error("This order isn't assigned to you");

      return await prisma.deliveryTracking.upsert({
        where: { orderId: order.id },
        update: { lat: args.lat, lng: args.lng },
        create: { orderId: order.id, lat: args.lat, lng: args.lng },
      });
    },
    MarkDelivered: async (
      _parent: unknown,
      args: { orderId: number },
      ctx: Context,
    ) => {
      isAuth(ctx);
      if (ctx.role !== "DELIVERY_PARTNER")
        throw new Error("Only delivery partners can do this");

      const order = await prisma.order.findUnique({
        where: { id: Number(args.orderId) },
      });
      if (!order) throw new Error("NOT_FOUND");
      if (order.deliveryPartnerId !== ctx.userId)
        throw new Error("This order isn't assigned to you");

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "DELIVERED", deliveredAt: new Date() },
      });

      return { success: true, msg: "Marked as delivered", order: updated };
    },
  },
};
