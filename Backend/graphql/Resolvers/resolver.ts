// import bcrypt from "bcryptjs";
// import { prisma } from "../../lib/prisma.js";
// import { accessCookieOptions, setToken } from "../../lib/jwtCookie.js";
// import { Context, isAdmin, isAuth, isOwner } from "../context.js";
// import {
//   checkAddress,
//   checkCategory,
//   checkCuisine,
//   checkDescription,
//   checkemail,
//   checkFirstName,
//   checkFssaiNumber,
//   checkGstNumber,
//   checkImageUrl,
//   checkLastName,
//   checkName,
//   checkPassword,
//   checkPhone,
//   checkPrice,
//   checkRestaurantName,
// } from "../../Validation/validate.js";
// import { razorpay } from "../../Razorpay/Razorpay.js";
// import crypto from "crypto";
// import { GraphQLError } from "graphql";
// import { authService } from "../../src/services/auth.service.js";

// export const resolvers = {
//   Query: {
//     GetCurrentUser: async (_parent: unknown, _args: unknown, ctx: Context) => {
//       isAuth(ctx);
//       const user = await prisma.user.findUnique({ where: { id: ctx.userId! } });
//       return user;
//     },
//     //admin
//     GetPendingRestaurants: async (
//       _parent: unknown,
//       _args: unknown,
//       ctx: Context,
//     ) => {
//       isAdmin(ctx);
//       return await prisma.restaurant.findMany({
//         where: { status: "PENDING" },
//         include: {
//           owner: true,
//           admin: true,
//         },
//       });
//     },
//     GetAdminDahsboard: async (
//       _parent: unknown,
//       _args: unknown,
//       ctx: Context,
//     ) => {
//       isAdmin(ctx);
//       const [
//         revenueAgg,
//         totalOrders,
//         totalRestaurants,
//         totalCustomers,
//         pendingRestaurants,
//         statusGroups,
//       ] = await Promise.all([
//         prisma.order.aggregate({
//           where: { status: { not: "CANCELED" } },
//           _sum: { totalAmount: true },
//         }),
//         prisma.order.count(),
//         prisma.restaurant.count({ where: { status: "APPROVED" } }),
//         prisma.user.count({ where: { role: "CUSTOMER" } }),
//         prisma.restaurant.count({ where: { status: "PENDING" } }),
//         prisma.order.groupBy({
//           by: ["status"],
//           _count: { status: true },
//         }),
//       ]);

//       return {
//         totalRevenue: revenueAgg._sum.totalAmount ?? 0,
//         totalOrders,
//         totalRestaurants,
//         totalCustomers,
//         pendingRestaurants,
//         ordersByStatus: statusGroups.map((g) => ({
//           status: g.status,
//           count: g._count.status,
//         })),
//       };
//     },
//     //owner
//     MyRestaurantMenu: async (
//       _parent: unknown,
//       _args: unknown,
//       ctx: Context,
//     ) => {
//       isOwner(ctx);
//       const restaurant = await prisma.restaurant.findFirst({
//         where: { ownerId: ctx.userId! },
//       });
//       if (!restaurant) throw new Error("No restaurant found for this owner");
//       return await prisma.menuItem.findMany({
//         where: { restaurantId: restaurant.id },
//       });
//     },
//     RestaurantOrders: async (
//       _parent: unknown,
//       _args: unknown,
//       ctx: Context,
//     ) => {
//       isOwner(ctx);
//       const restaurant = await prisma.restaurant.findFirst({
//         where: { ownerId: ctx.userId! },
//       });
//       if (!restaurant) throw new Error("No restaurant found for this owner");

//       return await prisma.order.findMany({
//         where: { restaurantId: restaurant.id },
//         include: { items: true, user: true },
//         orderBy: { placedAt: "desc" },
//       });
//     },

//     //customer
//     MyOrders: async (_parent: unknown, _args: unknown, ctx: Context) => {
//       isAuth(ctx);
//       return await prisma.order.findMany({
//         where: { userId: ctx.userId! },
//         include: { items: true, restaurant: true },
//         orderBy: { placedAt: "desc" },
//       });
//     },
//     GetRestaurants: async (_parent: unknown, _args: unknown, ctx: Context) => {
//       return await prisma.restaurant.findMany({
//         where: {
//           status: "APPROVED",
//         },
//         include: {
//           menus: true,
//           reviews: true,
//         },
//       });
//     },
//     FilterRestaurants: async (
//       _parent: unknown,
//       args: {
//         search?: string;
//         cuisine?: string;
//         vegOnly?: boolean;
//         rating?: number;
//       },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       let matchingRestaurantIds: number[] | undefined;

//       if (args.rating !== undefined) {
//         const avgByRestaurant = await prisma.review.groupBy({
//           by: ["restaurantId"],
//           _avg: { rating: true },
//         });

//         matchingRestaurantIds = avgByRestaurant
//           .filter((g) => (g._avg.rating ?? 0) >= args.rating!)
//           .map((g) => g.restaurantId);
//       }

//       const filterrestaurant = await prisma.restaurant.findMany({
//         where: {
//           status: "APPROVED",

//           ...(args.search && {
//             restaurantName: {
//               contains: args.search,
//               mode: "insensitive",
//             },
//           }),

//           ...(args.cuisine && {
//             cuisine: {
//               contains: args.cuisine,
//               mode: "insensitive",
//             },
//           }),

//           ...(args.vegOnly && {
//             menus: {
//               some: {
//                 isVeg: true,
//                 isAvailable: true,
//               },
//             },
//           }),

//           ...(matchingRestaurantIds && {
//             id: { in: matchingRestaurantIds },
//           }),
//         },
//         include: {
//           menus: true,
//           reviews: true,
//         },
//       });

//       return filterrestaurant;
//     },
//     GetMenuItems: async (
//       _parent: unknown,
//       args: { restaurantID: number },
//       ctx: Context,
//     ) => {
//       console.log(args.restaurantID);

//       isAuth(ctx);
//       return await prisma.menuItem.findMany({
//         where: {
//           restaurantId: args.restaurantID,
//         },
//       });
//     },
//     GetCart: async (
//       _parent: unknown,
//       args: { restaurantId: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const cart = await prisma.cart.findUnique({
//         where: {
//           userId_restaurantId: {
//             userId: ctx.userId!,
//             restaurantId: Number(args.restaurantId),
//           },
//         },
//         include: {
//           items: {
//             include: { menuItem: true },
//             restaurant: { select: { restaurantName: true } },
//           },
//         },
//       });

//       return cart;
//     },
//     AvailableDeliveryPartners: async (
//       _parent: unknown,
//       _args: unknown,
//       ctx: Context,
//     ) => {
//       isOwner(ctx);
//       return await prisma.user.findMany({
//         where: { role: "DELIVERY_PARTNER" },
//       });
//     },

//     MyAddresses: async (_parent: unknown, _args: unknown, ctx: Context) => {
//       isAuth(ctx);
//       return await prisma.address.findMany({
//         where: { userId: ctx.userId! },
//         orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
//       });
//     },
//     GetRestaurantReviews: async (
//       _parent: unknown,
//       args: { restaurantId: number },
//       ctx: Context,
//     ) => {
//       return await prisma.review.findMany({
//         where: { restaurantId: Number(args.restaurantId) },
//         include: { user: true },
//         orderBy: { createdAt: "desc" },
//       });
//     },
//     GetReaturantDetail: async (
//       _parent: unknown,
//       args: { restaurantId: number },
//       ctx: Context,
//     ) => {
//       console.log(ctx.role, ctx.userId);

//       isAuth(ctx);
//       return prisma.restaurant.findFirst({
//         where: { id: args.restaurantId },
//         include: { reviews: true },
//       });
//     },
//   },

//   Mutation: {
//     SignUp: async (
//       _parent: unknown,
//       args: {
//         firstname: string;
//         lastname: string;
//         email: string;
//         password: string;
//         phone: string;
//       },
//       _ctx: unknown,
//     ) => {
//       checkFirstName(args.firstname);
//       checkLastName(args.lastname);
//       checkemail(args.email);
//       checkPassword(args.password);

//       /* const existUser = await prisma.user.findUnique({
//         where: { email: args.email },
//       });

//       if (existUser) throw new Error("Email already exist");

//       const hashPassword = await bcrypt.hash(args.password.trim(), 10);

//       const user = await prisma.user.create({
//         data: {
//           firstname: args.firstname.trim(),
//           lastname: args.lastname.trim(),
//           email: args.email.toLowerCase().trim(),
//           password: hashPassword,
//         },
//       }); */
//       const user = await authService.signUp(args)

//       return { success: true, msg: "user signup successfully", user };
//     },

//     LogIn: async (
//       _parent: unknown,
//       args: { email: string; password: string },
//       ctx: Context,
//     ) => {
//       checkemail(args.email);
//       // checkPassword(args.password);
//       if (!args.password.trim()) {
//         throw new GraphQLError("Password is required", {
//           extensions: {
//             code: "Bad Input",
//             field: "password",
//           },
//         });
//       }
//       /* const userExist = await prisma.user.findUnique({
//         where: { email: args.email.toLowerCase().trim() },
//         include: { restaurant: true, approved: true },
//       });
//       if (!userExist) throw new Error("Email does not exist");

//       if (userExist.role !== "CUSTOMER") {
//         throw new Error("Please use the owner or admin login");
//       }
//       const match = await bcrypt.compare(args.password, userExist.password);
//       if (!match) throw new Error("Invalid credentials");
//  */

//       const user=await authService.login(args)
//       setToken(ctx.res, user.id, user.role);

//       return { success: true, msg: "Login successfully", user };
//     },
//     OwnerLogIn: async (
//       _parent: unknown,
//       args: { email: string; password: string },
//       ctx: Context,
//     ) => {
//       checkemail(args.email);
//       // checkPassword(args.password);
//       if (!args.password.trim()) {
//         throw new GraphQLError("Password is required", {
//           extensions: {
//             code: "Bad Input",
//             field: "password",
//           },
//         });
//       }
//       /* const owner = await prisma.user.findUnique({
//         where: { email: args.email.toLowerCase().trim() },
//       });

//       if (!owner) throw new Error("Invalid credentials");
//       if (owner.role !== "OWNER")
//         throw new Error("Invalid credentials to login as owner");

//       const passwordMatch = await bcrypt.compare(args.password, owner.password);
//       if (!passwordMatch)
//         throw new Error("Invalid credentials to login as owner"); */
//       const owner = await authService.ownerLogin(args)

//       setToken(ctx.res, owner.id, owner.role);

//       const { password, ...safeUser } = owner;
//       return {
//         success: true,
//         msg: "login successfully as owner",
//         user: safeUser,
//       };
//     },
//     AdminLogIn: async (
//       _parent: unknown,
//       args: { email: string; password: string },
//       ctx: Context,
//     ) => {
//       checkemail(args.email);
//       // checkPassword(args.password);
//       if (!args.password.trim()) {
//         throw new GraphQLError("Password is required", {
//           extensions: {
//             code: "Bad Input",
//             field: "password",
//           },
//         });
//       }

// /*       const admin = await prisma.user.findUnique({
//         where: { email: args.email.toLowerCase().trim() },
//       });
//       if (!admin) throw new Error("Invalid credentials");
//       if (admin.role !== "ADMIN")
//         throw new Error("Invalid credentials to login as admin");

//       const passwordMatch = await bcrypt.compare(args.password, admin.password);
//       if (!passwordMatch)
//         throw new Error("Invalid credentials to login as admin");
//  */
//       const admin= await authService.adminLogin(args)
//       setToken(ctx.res, admin.id, admin.role);

//       const { password, ...safeUser } = admin;
//       return {
//         success: true,
//         msg: "login successfully as admin",
//         user: safeUser,
//       };
//     },
//     DeliveryPartnerSignUp: async (
//       _parent: unknown,
//       args: {
//         firstname: string;
//         lastname: string;
//         email: string;
//         password: string;
//         phone: string;
//       },
//       _ctx: unknown,
//     ) => {
//       const email = args.email.toLowerCase().trim();
//       const existUser = await prisma.user.findUnique({ where: { email } });
//       if (existUser) throw new Error("Email already exist");

//       const hashPassword = await bcrypt.hash(args.password.trim(), 10);

//       const user = await prisma.user.create({
//         data: {
//           firstname: args.firstname.trim(),
//           lastname: args.lastname.trim(),
//           email,
//           password: hashPassword,
//           phone: args.phone,
//           role: "DELIVERY_PARTNER",
//         },
//       });

//       return { success: true, msg: "Delivery partner account created", user };
//     },
//     DeliveryPartnerLogIn: async (
//       _parent: unknown,
//       args: { email: string; password: string },
//       ctx: Context,
//     ) => {
//       checkemail(args.email);
//       // checkPassword(args.password);
//       if (!args.password.trim()) {
//         throw new GraphQLError("Password is required", {
//           extensions: {
//             code: "Bad Input",
//             field: "password",
//           },
//         });
//       }

//       /* const partner = await prisma.user.findUnique({
//         where: { email: args.email.toLowerCase().trim() },
//       });
//       if (!partner) throw new Error("Invalid credentials");
//       if (partner.role !== "DELIVERY_PARTNER")
//         throw new Error("Invalid credentials to login as delivery partner");

//       const passwordMatch = await bcrypt.compare(
//         args.password,
//         partner.password,
//       );
//       if (!passwordMatch)
//         throw new Error("Invalid credentials to login as delivery partner"); */
//       const partner=await authService.partnerLogin(args)

//       setToken(ctx.res, partner.id, partner.role);

//       const { password, ...safeUser } = partner;
//       return {
//         success: true,
//         msg: "login successfully as delivery partner",
//         user: safeUser,
//       };
//     },

//     LogOut: (_parent: unknown, args: unknown, ctx: Context) => {
//       if (!ctx.userId) {
//         throw new Error("You are not authenticated to logout");
//       }
//       ctx.res.clearCookie("accessToken", accessCookieOptions);
//       return { success: true, msg: "You loged out successfully" };
//     },

//     //Owner
//     RegisterRestaurantOwner: async (
//       _parent: unknown,
//       args: {
//         firstname: string;
//         lastname: string;
//         email: string;
//         password: string;
//         phone: string;
//         restaurantName: string;
//         cuisine: string;
//         address: string;
//         fssaiNumber?: string;
//         gstNumber?: string;
//       },
//       _ctx: unknown,
//     ) => {
//       checkFirstName(args.firstname);
//       checkLastName(args.lastname);
//       checkemail(args.email);
//       checkPhone(args.phone);
//       checkPassword(args.password);
//       checkRestaurantName(args.restaurantName);
//       checkCuisine(args.cuisine);
//       checkAddress(args.address);
//       checkFssaiNumber(args.fssaiNumber);
//       checkGstNumber(args.gstNumber);

//       const existUser = await prisma.user.findUnique({
//         where: { email: args.email },
//       });

//       if (existUser) {
//         throw new Error("An account already exists with this email");
//       }
//       const existingRestaurant = await prisma.restaurant.findFirst({
//         where: {
//           OR: [
//             { fssaiNumber: args.fssaiNumber?.trim() },
//             { gstNumber: args.gstNumber?.trim() },
//           ],
//         },
//       });

//       if (
//         existingRestaurant &&
//         (args.fssaiNumber?.trim() || args.gstNumber?.trim())
//       ) {
//         switch (existingRestaurant.status) {
//           case "PENDING":
//             throw new Error(
//               "This restaurant application is already under review.",
//             );

//           case "APPROVED":
//             throw new Error("This restaurant is already registered.");

//           case "REJECTED":
//             throw new Error(
//               "This restaurant application was rejected and cannot be submitted again.",
//             );
//         }
//       }

//       const hashPassword = await bcrypt.hash(args.password, 10);

//       const result = await prisma.$transaction(async (tx) => {
//         const user = await tx.user.create({
//           data: {
//             firstname: args.firstname,
//             lastname: args.lastname,
//             email: args.email,
//             password: hashPassword,
//             phone: args.phone,
//           },
//         });

//         const restaurant = await tx.restaurant.create({
//           data: {
//             restaurantName: args.restaurantName,
//             cuisine: args.cuisine,
//             address: args.address,
//             phone: args.phone,
//             fssaiNumber: args.fssaiNumber,
//             gstNumber: args.gstNumber,
//             ownerId: user.id,
//             status: "PENDING",
//           },
//         });

//         return { user, restaurant };
//       });
//       return {
//         success: true,
//         msg: "Account created and submitted — you'll be notified once reviewed",
//         restaurant: result.restaurant,
//       };
//     },

//     CreateMenuItem: async (
//       _parent: unknown,
//       args: {
//         name: string;
//         description?: string;
//         price: number;
//         category: string;
//         isVeg: boolean;
//         imageUrl?: string;
//         trackStock?: boolean;
//         stockQuantity?: number;
//       },
//       ctx: Context,
//     ) => {
//       isOwner(ctx);
//       checkName(args.name)
//       checkDescription(args.description)
//       checkPrice(args.price)
//       checkCategory(args.category)
//       checkImageUrl(args.imageUrl)

//       const restaurant = await prisma.restaurant.findFirst({
//         where: { ownerId: ctx.userId!, status: "APPROVED" },
//       });
//       console.log(restaurant);

//       if (!restaurant)
//         throw new Error("No approved restaurant found for this owner");

//       if (
//         args.trackStock &&
//         (args.stockQuantity === undefined || args.stockQuantity === null)
//       ) {
//         throw new Error("stockQuantity is required when trackStock is enabled");
//       }

//       const menu = await prisma.menuItem.create({
//         data: {
//           name: args.name,
//           description: args.description?.trim(),
//           price: Math.round(args.price * 100) / 100,
//           category: args.category,
//           isVeg: args.isVeg,
//           imageUrl: args.imageUrl,
//           trackStock: args.trackStock ?? false,
//           stockQuantity: args.trackStock ? args.stockQuantity : null,
//           restaurantId: restaurant.id,
//         },
//         include: {
//           restaurant: true,
//         },
//       });

//       return { success: true, msg: "Menu item created", menuItem: menu };
//     },
//     UpdateMenuItem: async (
//       _parent: unknown,
//       args: {
//         menuItemId: number;
//         name?: string;
//         description?: string;
//         price?: number;
//         category?: string;
//         isVeg?: boolean;
//         imageUrl?: string;
//       },
//       ctx: Context,
//     ) => {
//       isOwner(ctx);

//       const menuItem = await prisma.menuItem.findUnique({
//         where: { id: Number(args.menuItemId) },
//         include: { restaurant: true },
//       });
//       if (!menuItem) throw new Error("NOT_FOUND");
//       if (menuItem.restaurant.ownerId !== ctx.userId) {
//         throw new Error("You don't own this restaurant's menu");
//       }

//       const updated = await prisma.menuItem.update({
//         where: { id: menuItem.id },
//         data: {
//           name: args.name,
//           description: args.description,
//           price:
//             args.price !== undefined
//               ? Math.round(args.price * 100) / 100
//               : undefined,
//           category: args.category,
//           isVeg: args.isVeg,
//           imageUrl: args.imageUrl,
//         },
//       });

//       return { success: true, msg: "Menu item updated", menuItem: updated };
//     },

//     ToggleMenuItemAvailability: async (
//       _parent: unknown,
//       args: { menuItemId: number },
//       ctx: Context,
//     ) => {
//       isOwner(ctx);

//       const menuItem = await prisma.menuItem.findUnique({
//         where: { id: Number(args.menuItemId) },
//         include: { restaurant: true },
//       });
//       if (!menuItem) throw new Error("NOT_FOUND");
//       if (menuItem.restaurant.ownerId !== ctx.userId) {
//         throw new Error("You don't own this restaurant's menu");
//       }

//       const updated = await prisma.menuItem.update({
//         where: { id: menuItem.id },
//         data: { isAvailable: !menuItem.isAvailable },
//       });

//       return { success: true, msg: "Availability updated", menuItem: updated };
//     },

//     UpdateStock: async (
//       _parent: unknown,
//       args: { menuItemId: number; stockQuantity: number },
//       ctx: Context,
//     ) => {
//       isOwner(ctx);

//       const menuItem = await prisma.menuItem.findUnique({
//         where: { id: Number(args.menuItemId) },
//         include: { restaurant: true },
//       });
//       if (!menuItem) throw new Error("NOT_FOUND");
//       if (menuItem.restaurant.ownerId !== ctx.userId) {
//         throw new Error("You don't own this restaurant's menu");
//       }
//       if (!menuItem.trackStock) {
//         throw new Error("Enable stock tracking on this item first");
//       }

//       const updated = await prisma.menuItem.update({
//         where: { id: menuItem.id },
//         data: { stockQuantity: args.stockQuantity },
//       });

//       return { success: true, msg: "Stock updated", menuItem: updated };
//     },

//     DeleteMenuItem: async (
//       _parent: unknown,
//       args: { menuItemId: number },
//       ctx: Context,
//     ) => {
//       isOwner(ctx);

//       const menuItem = await prisma.menuItem.findUnique({
//         where: { id: Number(args.menuItemId) },
//         include: { restaurant: true },
//       });
//       if (!menuItem) throw new Error("NOT_FOUND");
//       if (menuItem.restaurant.ownerId !== ctx.userId) {
//         throw new Error("You don't own this restaurant's menu");
//       }

//       await prisma.menuItem.delete({ where: { id: menuItem.id } });

//       return { success: true, msg: "Menu item deleted", menuItem: null };
//     },

//     /*     UpdateOrderStatus: async (
//       _parent: unknown,
//       args: { orderId: number; status: "PREPARING" | "CANCELED" },
//       ctx: Context,
//     ) => {
//       isOwner(ctx);
//       const order = await prisma.order.findUnique({
//         where: { id: Number(args.orderId) },
//         include: { restaurant: true },
//       });
//       if (!order) throw new Error("NOT_FOUND");
//       if (order.restaurant.ownerId !== ctx.userId) {
//         throw new Error("Not your restaurant's order");
//       }
//       if (order.status !== "PLACED" && order.status !== "PREPARING") {
//         throw new Error(`Cannot update status once order is ${order.status}`);
//       }

//       const updated = await prisma.order.update({
//         where: { id: order.id },
//         data: { status: args.status },
//       });

//       return { success: true, msg: "Order status updated", order: updated };
//     },
//     handleUpateOrderStatus: async (
//       _parent: unknown,
//       args: { orderId: number; status: "CANCELED" },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);
//       const order = await prisma.order.findUnique({
//         where: { id: Number(args.orderId) },
//         include: { restaurant: true },
//       });
//       if (!order) throw new Error("Not_Found");
//       if (order.status !== "PLACED") {
//         throw new Error(`Cannot update status once order is ${order.status}`);
//       }
//       const updated = await prisma.order.update({
//         where: { id: order.id },
//         data: { status: args.status },
//       });
//       return {
//         success: true,
//         msg: "Order Cancelled successfully",
//         order: updated,
//       };
//     },
//         UpdateDeliveryOrderStatus: async (
//       _parent: unknown,
//       args: { orderId: number; status: "DELIVERED" },
//       ctx: Context,
//     ) => {
//       if (ctx.role !== "DELIVERY_PARTNER") {
//         throw new Error("You can't update this");
//       }

//       const order = await prisma.order.findUnique({
//         where: { id: Number(args.orderId), deliveryPartnerId: ctx.userId },
//         include: { restaurant: true },
//       });
//       console.log(order);

//       if (!order) throw new Error("Not Found");

//       if (
//         order.status !== "PLACED" &&
//         order.status !== "PREPARING" &&
//         order.status !== "OUT_FOR_DELIVERY"
//       ) {
//         throw new Error(`Cannot update status before assign the delivery`);
//       }

//       const updated = await prisma.order.update({
//         where: { id: order.id },
//         data: { status: args.status },
//       });

//       return {
//         success: true,
//         msg:"Order status updated",
//         order: updated,
//       };
//     }, */

//     UpdateOrderStatus: async (
//       _parent: unknown,
//       args: {
//         orderId: number;
//         status: "PREPARING" | "CANCELED" | "OUT_FOR_DELIVERY" | "DELIVERED";
//       },
//       ctx: Context,
//     ) => {
//       const order = await prisma.order.findUnique({
//         where: { id: Number(args.orderId) },
//         include: { restaurant: true },
//       });

//       if (!order) throw new Error("Order not found");

//       switch (ctx.role) {
//         case "OWNER":
//           if (order.restaurant.ownerId !== ctx.userId) {
//             throw new Error("Not your restaurant's order");
//           }

//           if (
//             !["PLACED", "PREPARING"].includes(order.status) ||
//             !["PREPARING", "CANCELED"].includes(args.status)
//           ) {
//             throw new Error("Invalid status update");
//           }
//           break;

//         case "CUSTOMER":
//           if (order.userId !== ctx.userId) {
//             throw new Error("Not your order");
//           }

//           if (order.status !== "PLACED" || args.status !== "CANCELED") {
//             throw new Error("You can only cancel a placed order");
//           }
//           break;

//         case "DELIVERY_PARTNER":
//           if (order.deliveryPartnerId !== ctx.userId) {
//             throw new Error("Not assigned to you");
//           }

//           if (
//             !["PREPARING", "OUT_FOR_DELIVERY"].includes(order.status) ||
//             args.status !== "DELIVERED"
//           ) {
//             throw new Error("Invalid delivery status update");
//           }
//           break;

//         default:
//           throw new Error("Unauthorized");
//       }

//       const updated = await prisma.order.update({
//         where: { id: order.id },
//         data: { status: args.status },
//       });

//       return {
//         success: true,
//         msg: "Order status updated",
//         order: updated,
//       };
//     },
//     AssignDeliveryPartner: async (
//       _parent: unknown,
//       args: { orderId: number; deliveryPartnerId: number },
//       ctx: Context,
//     ) => {
//       isOwner(ctx);
//       const order = await prisma.order.findUnique({
//         where: { id: Number(args.orderId) },
//         include: { restaurant: true },
//       });
//       if (!order) throw new Error("NOT_FOUND");
//       if (order.restaurant.ownerId !== ctx.userId)
//         throw new Error("Not your restaurant's order");
//       if (order.status !== "PREPARING") {
//         throw new Error(
//           "Order must be PREPARING before assigning a delivery partner",
//         );
//       }
//       const partner = await prisma.user.findUnique({
//         where: { id: Number(args.deliveryPartnerId) },
//       });
//       if (!partner || partner.role !== "DELIVERY_PARTNER") {
//         throw new Error("Invalid delivery partner");
//       }

//       const updated = await prisma.order.update({
//         where: { id: order.id },
//         data: {
//           deliveryPartnerId: partner.id,
//           status: "OUT_FOR_DELIVERY",
//         },
//       });

//       return {
//         success: true,
//         msg: "Delivery partner assigned",
//         order: updated,
//       };
//     },

//     //Customer
//     AddToCart: async (
//       _parent: unknown,
//       args: { menuItemId: number; quantity: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);
//       if (args.quantity < 1) {
//         throw new Error("Quantity must be greater than 0");
//       }
//       const menuItem = await prisma.menuItem.findUnique({
//         where: { id: Number(args.menuItemId) },
//       });
//       if (!menuItem) throw new Error("Menu item not found");
//       if (!menuItem.isAvailable)
//         throw new Error("This item is currently unavailable");

//       if (menuItem.trackStock) {
//         if ((menuItem.stockQuantity ?? 0) < args.quantity) {
//           throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
//         }
//       }
//       const cart = await prisma.cart.upsert({
//         where: {
//           userId_restaurantId: {
//             userId: ctx.userId!,
//             restaurantId: menuItem.restaurantId,
//           },
//         },
//         update: {},
//         create: {
//           userId: ctx.userId!,
//           restaurantId: menuItem.restaurantId,
//         },
//       });
//       const existingItem = await prisma.cartItem.findFirst({
//         where: { cartId: cart.id, menuItemId: menuItem.id },
//       });
//       let cartItem;
//       if (existingItem) {
//         const newQuantity = existingItem.quantity + args.quantity;
//         if (
//           menuItem.trackStock &&
//           (menuItem.stockQuantity ?? 0) < newQuantity
//         ) {
//           throw new Error(`Only ${menuItem.stockQuantity} left in stock`);
//         }
//         cartItem = await prisma.cartItem.update({
//           where: { id: existingItem.id },
//           data: { quantity: newQuantity },
//         });
//       } else {
//         cartItem = await prisma.cartItem.create({
//           data: {
//             cartId: cart.id,
//             menuItemId: menuItem.id,
//             quantity: args.quantity,
//             priceAtAdd: menuItem.price,
//           },
//         });
//       }

//       const fullCart = await prisma.cart.findUnique({
//         where: { id: cart.id },
//         include: { items: { include: { menuItem: true } } },
//       });

//       return { success: true, msg: "Added to cart", cart: fullCart };
//     },
//     DecreaseCartItem: async (
//       _parent: unknown,
//       args: { cartItemId: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const cartItem = await prisma.cartItem.findUnique({
//         where: { id: Number(args.cartItemId) },
//         include: { cart: true },
//       });
//       if (!cartItem) throw new Error("NOT_FOUND");
//       if (cartItem.cart.userId !== ctx.userId) {
//         throw new Error("Not your cart item");
//       }

//       if (cartItem.quantity <= 1) {
//         await prisma.cartItem.delete({ where: { id: cartItem.id } });
//       } else {
//         await prisma.cartItem.update({
//           where: { id: cartItem.id },
//           data: { quantity: cartItem.quantity - 1 },
//         });
//       }

//       const fullCart = await prisma.cart.findUnique({
//         where: { id: cartItem.cartId },
//         include: { items: { include: { menuItem: true } } },
//       });

//       return { success: true, msg: "Quantity updated", cart: fullCart };
//     },
//     RemoveFromCart: async (
//       _parent: unknown,
//       args: { cartItemId: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);
//       const cartItem = await prisma.cartItem.findUnique({
//         where: { id: Number(args.cartItemId) },
//         include: { cart: true },
//       });
//       if (!cartItem) throw new Error("NOT_FOUND");
//       if (cartItem.cart.userId !== ctx.userId) {
//         throw new Error("Not your cart item");
//       }
//       await prisma.cartItem.delete({ where: { id: cartItem.id } });
//       const fullCart = await prisma.cart.findUnique({
//         where: { id: cartItem.cartId },
//         include: { items: { include: { menuItem: true } } },
//       });
//       return { success: true, msg: "Item removed", cart: fullCart };
//     },
//     ClearCart: async (
//       _parent: unknown,
//       args: { cartId: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);
//       const cart = await prisma.cart.findUnique({
//         where: { id: Number(args.cartId) },
//       });
//       if (!cart) throw new Error("Cart not found");
//       if (cart.userId !== ctx.userId) throw new Error("this isn't your cart");

//       await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

//       return {
//         success: true,
//         msg: "Cart cleared",
//         cart: { ...cart, items: [] },
//       };
//     },

//     AddAddress: async (
//       _parent: unknown,
//       args: {
//         addressLine1: string;
//         city: string;
//         state: string;
//         pincode: string;
//         country?: string;
//         lat?: number;
//         lng?: number;
//         isDefault?: boolean;
//       },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const address = await prisma.address.create({
//         data: {
//           userId: ctx.userId!,
//           addressLine1: args.addressLine1,
//           city: args.city,
//           state: args.state,
//           pincode: args.pincode,
//           country: args.country ?? "India",
//           lat: args.lat,
//           lng: args.lng,
//         },
//       });

//       return { success: true, msg: "Address added", address };
//     },

//     UpdateAddress: async (
//       _parent: unknown,
//       args: {
//         addressId: number;
//         addressLine1?: string;
//         city?: string;
//         state?: string;
//         pincode?: string;
//         lat?: number;
//         lng?: number;
//       },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const existing = await prisma.address.findUnique({
//         where: { id: Number(args.addressId) },
//       });
//       if (!existing) throw new Error("NOT_FOUND");
//       if (existing.userId !== ctx.userId) throw new Error("Not your address");

//       const updated = await prisma.address.update({
//         where: { id: existing.id },
//         data: {
//           addressLine1: args.addressLine1,
//           city: args.city,
//           state: args.state,
//           pincode: args.pincode,
//           lat: args.lat,
//           lng: args.lng,
//         },
//       });

//       return { success: true, msg: "Address updated", address: updated };
//     },

//     DeleteAddress: async (
//       _parent: unknown,
//       args: { addressId: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const existing = await prisma.address.findUnique({
//         where: { id: Number(args.addressId) },
//       });
//       if (!existing) throw new Error("NOT_FOUND");
//       if (existing.userId !== ctx.userId) throw new Error("Not your address");

//       try {
//         await prisma.address.delete({ where: { id: existing.id } });
//       } catch (err) {
//         throw new Error(
//           "can't delete this address because it linked with order",
//         );
//       }

//       return { success: true, msg: "Address deleted", address: null };
//     },

// /*     PlaceOrder: async (
//       _parent: unknown,
//       args: { cartId: number; addressId: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const cart = await prisma.cart.findUnique({
//         where: { id: Number(args.cartId) },
//         include: { items: { include: { menuItem: true } } },
//       });
//       if (!cart) throw new Error("NOT_FOUND");
//       if (cart.userId !== ctx.userId) throw new Error("not your cart");
//       if (cart.items.length === 0) throw new Error("cart is empty");

//       const address = await prisma.address.findUnique({
//         where: { id: Number(args.addressId) },
//       });
//       if (!address) throw new Error("Address not found");
//       if (address.userId !== ctx.userId) throw new Error("Not your address");

//       const addressSnapshot = [
//         address.addressLine1,
//         address.city,
//         address.state,
//         address.pincode,
//         address.country,
//       ]
//         .filter(Boolean)
//         .join(", ");

//       const order = await prisma.$transaction(async (tx) => {
//         for (const item of cart.items) {
//           if (item.menuItem.trackStock) {
//             const result = await tx.menuItem.updateMany({
//               where: {
//                 id: item.menuItemId,
//                 stockQuantity: { gte: item.quantity },
//               },
//               data: { stockQuantity: { decrement: item.quantity } },
//             });
//             if (result.count === 0) {
//               throw new Error(
//                 `${item.menuItem.name} no longer has enough stock`,
//               );
//             }
//           }
//         }
//         const subtotal = cart.items.reduce(
//           (sum, i) => sum + i.priceAtAdd * i.quantity,
//           0,
//         );
//         const deliveryFee = 49;
//         const totalAmount = subtotal + deliveryFee;

//         return tx.order.create({
//           data: {
//             userId: ctx.userId!,
//             restaurantId: cart.restaurantId,
//             deliveryAddressId: address.id,
//             addressSnapshot,
//             subtotal,
//             deliveryFee,
//             totalAmount,
//             items: {
//               create: cart.items.map((item) => ({
//                 menuItemId: item.menuItemId,
//                 nameSnapshot: item.menuItem.name,
//                 priceSnapshot: item.priceAtAdd,
//                 quantity: item.quantity,
//               })),
//             },
//           },
//           include: { items: true },
//         });
//       });

//       return { success: true, msg: "Order placed", order };
//     }, */

//     PayOrder: async (
//       _parent: unknown,
//       args: { orderId: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const order = await prisma.order.findUnique({
//         where: { id: Number(args.orderId) },
//       });
//       if (!order) throw new Error("NOT_FOUND");
//       if (order.userId !== ctx.userId) {
//         throw new Error("not your order");
//       }

//       try {
//         const razorpayOrder = await razorpay.orders.create({
//           amount: Math.round(order.totalAmount * 100),
//           currency: "INR",
//           receipt: `order_${order.id}`,
//         });

//         return {
//           success: true,
//           msg: "Razorpay order created",
//           razorpayOrder,
//         };
//       } catch (error) {
//         console.error(error);
//         throw new Error("Error in razorpay services");
//       }
//     },
//     VerifyPayment: async (
//       _parent: unknown,
//       args: {
//         orderId: number;
//         razorpayOrderId: string;
//         razorpayPaymentId: string;
//         razorpaySignature: string;
//       },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const body = `${args.razorpayOrderId}|${args.razorpayPaymentId}`;
//       const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//         .update(body)
//         .digest("hex");

//       if (expectedSignature !== args.razorpaySignature) {
//         throw new Error("Payment verification failed");
//       }

//       const order = await prisma.order.findUnique({
//         where: { id: Number(args.orderId) },
//       });
//       if (!order) throw new Error("NOT_FOUND");
//       if (order.userId !== ctx.userId) throw new Error("This isn't your order");

//       const updated = await prisma.order.update({
//         where: { id: order.id },
//         data: { status: "PREPARING" },
//       });
//       const cart = await prisma.cart.findFirst({
//         where: {
//           userId: ctx.userId,
//         },
//       });

//       if (cart) {
//         await prisma.cartItem.deleteMany({
//           where: {
//             cartId: cart.id,
//           },
//         });
//       }

//       return { success: true, msg: "Payment verified", order: updated };
//     },

//     //review
//     SubmitReview: async (
//       _parent: unknown,
//       args: { restaurantId: number; rating: number; comment?: string },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       if (args.rating < 1 || args.rating > 5) {
//         throw new Error("Rating must be between 1 and 5");
//       }

//       const restaurant = await prisma.restaurant.findUnique({
//         where: { id: Number(args.restaurantId) },
//       });
//       if (!restaurant) throw new Error("NOT_FOUND");

//       const existing = await prisma.review.findUnique({
//         where: {
//           userId_restaurantId: {
//             userId: ctx.userId!,
//             restaurantId: restaurant.id,
//           },
//         },
//       });
//       if (existing) throw new Error("You've already reviewed this restaurant");

//       const review = await prisma.review.create({
//         data: {
//           rating: args.rating,
//           comment: args.comment,
//           userId: ctx.userId!,
//           restaurantId: restaurant.id,
//         },
//         include: { user: true },
//       });

//       return { success: true, msg: "Review submitted", review };
//     },

//     UpdateReview: async (
//       _parent: unknown,
//       args: { reviewId: number; rating?: number; comment?: string },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const existing = await prisma.review.findUnique({
//         where: { id: Number(args.reviewId) },
//       });
//       if (!existing) throw new Error("NOT_FOUND");
//       if (existing.userId !== ctx.userId) throw new Error("Not your review");

//       if (args.rating !== undefined && (args.rating < 1 || args.rating > 5)) {
//         throw new Error("Rating must be between 1 and 5");
//       }

//       const updated = await prisma.review.update({
//         where: { id: existing.id },
//         data: {
//           rating: args.rating ?? existing.rating,
//           comment: args.comment ?? existing.comment,
//         },
//         include: { user: true },
//       });

//       return { success: true, msg: "Review updated", review: updated };
//     },

//     DeleteReview: async (
//       _parent: unknown,
//       args: { reviewId: number },
//       ctx: Context,
//     ) => {
//       isAuth(ctx);

//       const existing = await prisma.review.findUnique({
//         where: { id: Number(args.reviewId) },
//       });
//       if (!existing) throw new Error("NOT_FOUND");
//       if (existing.userId !== ctx.userId) throw new Error("Not your review");

//       await prisma.review.delete({ where: { id: existing.id } });

//       return { success: true, msg: "Review deleted", review: null };
//     },

//     //admin
//     ApproveRestaurant: async (
//       _parent: unknown,
//       args: { restaurantId: number },
//       ctx: Context,
//     ) => {
//       isAdmin(ctx);

//       const restaurant = await prisma.restaurant.findUnique({
//         where: { id: Number(args.restaurantId) },
//       });
//       if (!restaurant) throw new Error("NOT_FOUND");
//       if (restaurant.status !== "PENDING")
//         throw new Error("Already processed!");

//       const updated = await prisma.restaurant.update({
//         where: { id: restaurant.id },
//         data: {
//           status: "APPROVED",
//           approvedBy: ctx.userId!,
//           approvedAt: new Date(),
//         },
//       });

//       await prisma.user.update({
//         where: { id: restaurant.ownerId },
//         data: { role: "OWNER" },
//       });

//       return { success: true, msg: "Approved", restaurant: updated };
//     },
//     RejectRestaurant: async (
//       _parent: unknown,
//       args: { restaurantId: number },
//       ctx: Context,
//     ) => {
//       isAdmin(ctx);

//       const restaurant = await prisma.restaurant.findUnique({
//         where: {
//           id: Number(args.restaurantId),
//         },
//       });

//       if (!restaurant) throw new Error("NOT_FOUND");
//       if (restaurant.status !== "PENDING")
//         throw new Error("Already processed!");

//       const updated = await prisma.restaurant.update({
//         where: { id: restaurant.id },
//         data: {
//           status: "REJECTED",
//           approvedBy: ctx.userId!,
//           approvedAt: new Date(),
//         },
//       });

//       return { success: true, msg: "Rejected", restaurant: updated };
//     },

//     //Delivery_man
//     UpdateDeliveryLocation: async (
//       _parent: unknown,
//       args: { orderId: number; lat: number; lng: number },
//       ctx: Context,
//     ) => {
//       if (ctx.role !== "DELIVERY_PARTNER")
//         throw new Error("Only delivery partners can update location");

//       const order = await prisma.order.findUnique({
//         where: { id: Number(args.orderId) },
//       });
//       if (!order) throw new Error("NOT_FOUND");
//       if (order.deliveryPartnerId !== ctx.userId)
//         throw new Error("This order isn't assigned to you");

//       return await prisma.deliveryTracking.upsert({
//         where: { orderId: order.id },
//         update: { lat: args.lat, lng: args.lng },
//         create: { orderId: order.id, lat: args.lat, lng: args.lng },
//       });
//     },
//   },
// };



export const resolvers = {};