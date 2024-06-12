const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

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
          return authors.map(author => {
            const bookCount = author.books.length
            return {...author.toObject(), bookCount}
          
          })
      },
      me: async (root, args, context) => {
        return context.currentUser
      }
    },
    Mutation: {
      addBook: async (root, args, context) => {
          const currentUser = context.currentUser
  
          if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
              }
            })
          }
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

          await Author.findOneAndUpdate({name: args.author}, {books: [...author.books, book._id]}, {new: true})

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

          pubsub.publish('BOOK_ADDED', {bookAdded: book})

          return book
      },
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
  
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
          let author = await Author.findOne({name: args.name})
          if (!author) {
              return null
          }
          author.born = args.setBornTo
          return author.save()
      },
      createUser: async (root, args) => {
        const user = new User ({
          username: args.username,
          favoriteGenre: args.favoriteGenre
        })
        try {
          await user.save()
        } catch (error) {
          throw new GraphQLError('Creating user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        }
        return user
      },
      login: async (root, args) => {
        const user = await User.findOne({username: args.username})
        if (args.password !== 'salis') {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
        return { value: jwt.sign(userForToken, process.env.SECRET) }
      }
      },
      Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
      }
}

module.exports = resolvers