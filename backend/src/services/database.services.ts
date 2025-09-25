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
import Voucher from '~/models/schemas/Voucher.schema'
import Blog from '~/models/schemas/Blog.schema'
import UserRoutine from '~/models/schemas/UserRoutine.schema'
import AIUsage from '~/models/schemas/AIUsage.schema'
import PostView from '~/models/schemas/PostView.schema'

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

  getClient() {
    return this.client
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION as string)
  }
  get userRoutines(): Collection<UserRoutine> {
    return this.db.collection(process.env.DB_USER_ROUTINES_COLLECTION as string)
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
  collection(collectionName: string): Collection<any> {
    return this.db.collection(collectionName)
  }
  async indexUsers() {
    await this.users.createIndex({ email: 1 }, { unique: true })
    await this.users.createIndex({ username: 1 }, { unique: true })
    await this.users.createIndex({ email: 1, password: 1 })
  }

  async indexVouchers() {
    await this.vouchers.createIndex({ code: 1 }, { unique: true })
  }

  async indexProducts() {
    //Index để tối ưu tìm kiếm theo tên sản phẩm `text` index cho phép dùng toán tử $text và $search
    //await this.products.createIndex({ name_on_list: 'text', engName_on_list: 'text' });
    //Index để tối ưu sắp xếp cho việc phân trang -1 là sắp xếp giảm dần (mới nhất trước)
    // await this.products.createIndex({ created_at: -1 });
    //Index cho các trường filter phổ biến
    //await this.products.createIndex({ filter_brand: 1 });
    //await this.products.createIndex({ state: 1 });
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get reviews(): Collection<FeedBack> {
    return this.db.collection(process.env.DB_REVIEW_COLLECTION as string)
  }

  get vouchers(): Collection<Voucher> {
    return this.db.collection(process.env.DB_VOUCHER_COLLECTION as string)
  }

  get posts(): Collection<Blog> {
    return this.db.collection(process.env.DB_POST_COLLECTION as string)
  }

  get aiUsages(): Collection<AIUsage> {
    return this.db.collection(process.env.DB_AI_USAGE_COLLECTION as string)
  }
  get postViews(): Collection<PostView> {
    return this.db.collection(process.env.DB_POST_VIEWS_COLLECTION as string)
  }

}

const databaseService = new DatabaseService()
export default databaseService
