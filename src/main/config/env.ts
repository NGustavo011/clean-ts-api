export default {
  port: process.env.PORT ?? 3333,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://root:pass@localhost:27017'
}
