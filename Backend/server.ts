import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { createServer } from "node:http";
import { resolvers } from "./graphql/Resolvers/resolver";
import { typeDefs } from "./graphql/Typedefs/typeDefs";
import { Context, createCheckAuth } from "./graphql/context";
import cookieParser from 'cookie-parser'
import uploadRouter from './Routes/uploadRoute'
import cors from 'cors'

const app = express();
app.use(cookieParser())
const port = process.env.PORT || 4003;

const httpServer = createServer(app);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
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

async function startServer() {
  await server.start();
  app.use("/graphql", express.json(), expressMiddleware<Context>(server,{
    context:createCheckAuth
  }));
  httpServer.listen(port, () => {
    console.log(`Server is ready to listen at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Server failed to start ", err);
});
