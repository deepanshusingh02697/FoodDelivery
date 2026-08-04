import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { createServer } from "node:http";
// import { resolvers } from "./graphql/Resolvers/resolver.js";
// import { typeDefs } from "./graphql/Typedefs/typeDefs.js";
import { Context, createCheckAuth } from "./graphql/context.js";
import cookieParser from "cookie-parser";
import uploadRouter from "./Routes/uploadRoute.js";
import cors from "cors";
import { AppDataSource } from "./src/config/data-source.js";

import { buildSchema } from "type-graphql";
import { HelloResolver } from "./src/graphql/Mutations/HelloResolver.js";
import { AuthResolver } from "./src/graphql/Mutations/AuthResolver.js";
import { RestaurantResolver } from "./src/graphql/Mutations/RestaurantResolver.js";
import { CartResolver } from "./src/graphql/Mutations/CartResolver.js";
import { MenuItemResolver } from "./src/graphql/Mutations/MenuItemResolver.js";
import { OrderResolver } from "./src/graphql/Mutations/OrderResolver.js";
import { ReviewResolver } from "./src/graphql/Mutations/ReviewResolver.js";
import { RazorpayResolver } from "./src/graphql/Mutations/RazorpayResolver.js";
import { AddressResolver } from "./src/graphql/Mutations/AddressResolver.js";
import { AuthQuery } from "./src/graphql/Querys/AuthQuery.js";
import { RestaurantQuery } from "./src/graphql/Querys/RestaurantQuery.js";
import { MenuItemQuery } from "./src/graphql/Querys/MenuItemQuery.js";
import { OrderQuery } from "./src/graphql/Querys/OrderQuery.js";
import { AdminDashboardQuery } from "./src/graphql/Querys/AdminDashboardQuery.js";
import { AddressQuery } from "./src/graphql/Querys/AddressQuery.js";
import { CartQuery } from "./src/graphql/Querys/CartQuery.js";
import { ReviewQuery } from "./src/graphql/Querys/ReviewQuery.js";

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
        AuthQuery,
        RestaurantQuery,
        OrderQuery,
        CartQuery,
        MenuItemQuery,
        AdminDashboardQuery,
        AddressQuery,
        ReviewQuery,
        HelloResolver,
        AuthResolver,
        AddressResolver,
        RestaurantResolver,
        CartResolver,
        MenuItemResolver,
        OrderResolver,
        ReviewResolver,
        RazorpayResolver,
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
