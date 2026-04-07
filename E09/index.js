import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Album from "./models/Album.js";

// Load env variables
dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

// GraphQL schema
const typeDefs = `#graphql
  type Album {
    id: ID!
    artist: String!
    title: String!
    year: Int!
  }

  type Query {
    albums: [Album!]!
    album(id: ID!): Album
  }

  type Mutation {
    deleteAlbum(id: ID!): Album
  }
`;

// Resolvers
const resolvers = {
  Query: {
    albums: async () => {
      return await Album.find();
    },
    album: async (_, { id }) => {
      return await Album.findById(id);
    }
  },

  Mutation: {
    deleteAlbum: async (_, { id }) => {
      const deleted = await Album.findByIdAndDelete(id);
      return deleted;
    }
  }
};

// Create server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Start server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Server ready at ${url}`);