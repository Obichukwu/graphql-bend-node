const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany()
    },
    link: async (parent, args, context) => {
      return context.prisma.link.find(el => el.id === args.id)
    }
  },

  Mutation: {
    post: async (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },

    updateLink: async (parent, args, context) => {
      const link = context.prisma.link.update({
        where: { id: args.id },
        data: {
          description: args.description,
          url: args.url
        }
      })
      return link
    },

    deleteLink: async (parent, args, context) => {
      const link = context.prisma.link.update({
        where: { id: args.id }
      })
      return link
    }
  },
}


const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient()
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma,
  }
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );