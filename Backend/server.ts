import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { createServer } from "node:http";
import { Context, createCheckAuth } from "./src/middleware/context.js";
import cookieParser from "cookie-parser";
import uploadRouter from "./Routes/uploadRoute.js";
import cors from "cors";
import { AppDataSource } from "./src/config/data-source.js";

import { buildSchema } from "type-graphql";
import { AuthResolver } from "./src/resolver/auth.resolver.js";
import { RestaurantResolver } from "./src/resolver/restaurant.resolver.js";
import { CartResolver } from "./src/resolver/cart.resolver.js";
import { MenuItemResolver } from "./src/resolver/menuitems.resolver.js";
import { OrderResolver } from "./src/resolver/order.resolver.js";
import { ReviewResolver } from "./src/resolver/review.resolver.js";

import { AddressResolver } from "./src/resolver/address.resolver.js";
import { AdminDashboardQuery } from "./src/resolver/admin.resolver.js";
import { RazorpayResolver } from "./src/resolver/razorpay.resolver.js";


const app = express();
app.use(cookieParser());
const port = process.env.PORT || 4003;

const httpServer = createServer(app);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fooddelivery-backend-vkbb.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// const server = new ApolloServer<Context>({
//   typeDefs,
//   resolvers,
// });

app.use("/upload", uploadRouter);

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Database Connected");

    const schema = await buildSchema({
      resolvers: [
        AuthResolver,
        AddressResolver,
        RestaurantResolver,
        CartResolver,
        MenuItemResolver,
        OrderResolver,
        ReviewResolver,
        RazorpayResolver,
        AdminDashboardQuery
      ],
    });
    const server = new ApolloServer<Context>({ schema });

    await server.start();

    app.use(
      "/graphql",
      express.json(),
      expressMiddleware(server, {
        context: createCheckAuth,
      }),
    );

    httpServer.listen(port, () => {
      console.log(`Server is ready to listen at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer().catch((error) => {
  console.error(error);
  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  }
  throw error;
});
