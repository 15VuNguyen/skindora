import express from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { app, server } from './lib/socket'
import swaggerUi from 'swagger-ui-express'
// import YAML from 'yamljs'
// import path from 'path'
import filtersRouter from './routes/filters.routes'
import { aiRouter } from './routes/ai.routes'
import paymentsRouter from './routes/payments.routes'
import cors from 'cors'
import reviewRouters from './routes/reviews.routes'
import swaggerDocument from '../public/openapi.json'
import productRouter from './routes/products.routes'
import { checkVoucherJob, dailyReport } from './utils/cron/email.services'
import adminRouter from './routes/admin.routes'
import cartRouter from './routes/cart.routes'
import ordersRouter from './routes/orders.routes'
import staffRouter from './routes/staffs.routes'
import { connectProducer, waitForKafkaReady } from './services/Kafka/kafka.services'
import { startVoucherConsumer } from './services/Kafka/consumer'
import blogRouter from './routes/blogs.routes'

config()
// const swaggerDocument = YAML.load(path.join(__dirname, './openapi.yml'))
// const swaggerDocument = require(path.join(__dirname, '../public/openapi.json'));
dailyReport.start()
checkVoucherJob.start()
const port = process.env.PORT
;(app.use(
  cors({
    origin: process.env.CORS_ORIGIN
  })
),
  app.use(express.json({ limit: '50mb' })))
app.use(express.urlencoded({ extended: true }))

databaseService.connect().then(async () => {
  databaseService.indexUsers()
  databaseService.indexVouchers()
  // databaseService.indexProducts()

  await waitForKafkaReady()
  await connectProducer()
  await startVoucherConsumer()
})

app.get('/', (req, res) => {
  res.send('hello skindora develop branch')
})

app.use('/users', usersRouter)
app.use('/carts', cartRouter)
app.use('/orders', ordersRouter)
app.use('/payment', paymentsRouter)
app.use('/review', reviewRouters)
app.use('/products', productRouter)
app.use('/admin', adminRouter)
app.use('/staffs', staffRouter)
app.use('/posts', blogRouter)
app.use('/filters', filtersRouter) 
app.use('/ai', aiRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(defaultErrorHandler)

server.listen(port, () => {
  console.log(`Skindora server is running on port ${port}`)
})
