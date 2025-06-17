import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Order from '~/models/schemas/Orders/Order.schema'
import OrderDetail from '~/models/schemas/Orders/OrderDetail.schema'
import FeedBack from '~/models/schemas/Reviewschema'
import Product from '~/models/schemas/Product.schema'
import FilterBrand from '~/models/schemas/FilterBrand.schema'
import FilterDacTinh from '~/models/schemas/FilterDacTinh.schema'
import FilterHskIngredient from '~/models/schemas/FilterHskIngredient.schema'
import FilterHskProductType from '~/models/schemas/FilterHskProductType.schema'
import FilterHskSize from '~/models/schemas/FilterHskSize.schema'
import FilterHskSkinType from '~/models/schemas/FilterHskSkinType.schema'
import FilterHskUses from '~/models/schemas/FilterHskUses.schema'
import FilterOrigin from '~/models/schemas/FilterHskOrigin.schema'

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

  get filterBrand(): Collection<FilterBrand> {
    return this.db.collection(process.env.DB_FILTER_BRAND_COLLECTION as string)
  }

  get filterDacTinh(): Collection<FilterDacTinh> {
    return this.db.collection(process.env.DB_FILTER_DAC_TINH_COLLECTION as string)
  }

  get filterHskIngredient(): Collection<FilterHskIngredient> {
    return this.db.collection(process.env.DB_FILTER_HSK_INGREDIENT_COLLECTION as string)
  }

  get filterHskProductType(): Collection<FilterHskProductType> {
    return this.db.collection(process.env.DB_FILTER_HSK_PRODUCT_TYPE_COLLECTION as string)
  }

  get filterHskSize(): Collection<FilterHskSize> {
    return this.db.collection(process.env.DB_FILTER_HSK_SIZE_COLLECTION as string)
  }

  get filterHskSkinType(): Collection<FilterHskSkinType> {
    return this.db.collection(process.env.DB_FILTER_HSK_SKIN_TYPE_COLLECTION as string)
  }

  get filterHskUses(): Collection<FilterHskUses> {
    return this.db.collection(process.env.DB_FILTER_HSK_USES_COLLECTION as string)
  }

  get filterOrigin(): Collection<FilterOrigin> {
    return this.db.collection(process.env.DB_FILTER_ORIGIN_COLLECTION as string)
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
