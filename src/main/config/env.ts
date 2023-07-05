import dotenv from 'dotenv'
dotenv.config()
export default {
  port: process.env.PORT ?? 5000,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://root:pass@mongo:27017',
  jwtSecret: process.env.JWT_SECRET ?? 'tj670==5H'
}
