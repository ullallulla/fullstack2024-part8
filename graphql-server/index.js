const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = `
  type Author {
    name: String!,
    id: ID
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
        title: String!
        published: Int!
        author: String!
        id: ID
        genres: [String!]!
    ): Book

    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({})
      return books.length
    },
    authorCount: async () => {
      const authors = await Author.find({})
      return authors.length
    },
    allBooks: async (root, args) => {
      let book = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return null
        }
        book.author = author._id
      }
      if (args.genre) {
        book.genres = args.genre;
      }
      return Book.find(book).populate('author', { name: 1, born: 1, bookCount: 1 });
    },
    allAuthors: async () => {
        const authors = await Author.find({})
        return await Promise.all(authors.map( async (author) => {
            const bookCount = await Book.countDocuments({author: authors[0]._id}).count().exec() 
            return {...author.toObject(), bookCount}
          }))
    }
  },
  Mutation: {
    addBook: async (root, args) => {
        let author = await Author.findOne({name: args.author})
        if (!author) {
          author = new Author({name: args.author})
          try {
            await author.save()
          } catch (error) {
            throw new GraphQLError('Author name too short, needs at least 4 characters', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error
              }
            })
          }
        }
        
        const book = new Book({
          title: args.title,
          published: args.published,
          author: author,
          genres:args.genres
        })

        try {
          await book.save()
        } catch (error) {
          throw new GraphQLError('Title too short, needs at least 5 characters', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          })
        }
        return book
    },
    editAuthor: async (root, args) => {
        let author = await Author.findOne({name: args.name})
        if (!author) {
            return null
        }
        author.born = args.setBornTo
        return author.save()
    }
  }
}

// try {
//   await person.save()
// } catch (error) {
//   throw new GraphQLError('Saving number failed', {
//     extensions: {
//       code: 'BAD_USER_INPUT',
//       invalidArgs: args.name,
//       error
//     }
//   })
// }

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})