import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { ApolloServer} from "apollo-server"
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from 'graphql-ws/lib/use/ws';

import mongoose from 'mongoose';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import cors from 'cors';
import context from './middleware/context.js';


const startServer = async () => {
const app = express();

await mongoose.connect(process.env.MONGODB_URI);
console.log("🛢️ Connected to MongoDB",process.env.MONGODB_URI)

const httpServer = createServer(app);

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            wsServer.close();
          }
        };
      }
    }],
  });

app.use(cors({
  origin: '*', // Or use ['http://localhost:19006'] for security
  credentials: true
}));

await apolloServer.start();
apolloServer.applyMiddleware({ app });
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
  
useServer({ schema: apolloServer.schema }, wsServer);

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`📡 Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

startServer();



