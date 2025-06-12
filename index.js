import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';

import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import context from './middleware/context.js';

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  // MongoDB Connection
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("🛢️ Connected to MongoDB", process.env.MONGODB_URI);

  // Create GraphQL schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Setup WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  const serverCleanup = useServer({ schema }, wsServer);

  // Create Apollo Server instance
  const apolloServer = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    }],
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(apolloServer, {
      context,
    })
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📡 Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
};

startServer();
