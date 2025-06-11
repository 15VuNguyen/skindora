import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Order from '~/models/schemas/Orders/Order.schema'
import OrderDetail from '~/models/schemas/Orders/OrderDetail.schema'
import FeedBack from '~/models/schemas/Reviewschema'
import Product from '~/models/schemas/Product.schema'

config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@skindora.rbbhqia.mongodb.net/?retryWrites=true&w=majority&appName=skindora`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Skindora successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION as string)
  }

  get orders(): Collection<Order> {
    return this.db.collection(process.env.DB_ORDERS_COLLECTION as string)
  }

  get orderDetails(): Collection<OrderDetail> {
    return this.db.collection(process.env.DB_ORDER_DETAIL_COLLECTION as string)
  }

  async indexUsers() {
    await this.users.createIndex({ email: 1 }, { unique: true })
    await this.users.createIndex({ username: 1 }, { unique: true })
    await this.users.createIndex({ email: 1, password: 1 })
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get reviews(): Collection<FeedBack> {
    return this.db.collection(process.env.DB_REVIEW_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
