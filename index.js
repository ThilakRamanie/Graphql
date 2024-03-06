import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import db from "./db.js";
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args, context) {
      return db.games.find((game) => game.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args, context) {
      return db.authors.find((author) => author.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, args, context) {
      return db.reviews.find((review) => review.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    game(parent) {
      return db.games.find((r) => r.id === parent.game_id);
    },
    author(parent) {
      return db.authors.find((r) => r.id === parent.author_id);
    },
  },
  Mutation: {
    deleteGame(_, args, context) {
      db.games = db.games.filter((game) => game.id !== args.id);
      return db.games;
    },
    addGame(_, args, context) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.games.push(game);
      return game;
    },
    updateGame(_, args) {
      db.games = db.games.map((g) => {
        if (g.id === args.id) {
          return { ...g, ...args.edits }
        }
        return g
      });
      return db.games.find((g) => g.id === args.id);
    }
  },
};

//server setup

const server = new ApolloServer({
  //typeDefs
  typeDefs,
  //resolvers
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server ready at port 4000");
