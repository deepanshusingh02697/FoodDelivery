import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { createServer } from "node:http";
import { resolvers } from "./graphql/Resolvers/resolver.js";
import { typeDefs } from "./graphql/Typedefs/typeDefs.js";
import { Context, createCheckAuth } from "./graphql/context.js";
import cookieParser from "cookie-parser";
import uploadRouter from "./Routes/uploadRoute.js";
import cors from "cors";
import { AppDataSource } from "./src/config/data-source.js";

const app = express();
app.use(cookieParser())
const port = process.env.PORT || 4003;

const httpServer = createServer(app);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fooddelivery-backend-vkbb.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
)


const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});
app.use("/upload", uploadRouter);

/* async function startServer() {
  await server.start();
  app.use("/graphql", express.json(), expressMiddleware<Context>(server,{
    context:createCheckAuth
  }));
  httpServer.listen(port, () => {
    console.log(`Server is ready to listen at http://localhost:${port}`);
  });
} */
async function startServer(){
  try {
    await AppDataSource.initialize()
    console.log("Database Connected");

    // start apollo
    await server.start()

    app.use("/graphql",express.json(),expressMiddleware(server,{
      context:createCheckAuth
    }))

    httpServer.listen(port,()=>{
      console.log(`Server is ready to listen at http://localhost:${port}`);
    })
    
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
