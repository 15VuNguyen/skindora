import express from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { app, server } from './lib/socket'
import swaggerUi from 'swagger-ui-express'
// import YAML from 'yamljs'
// import path from 'path'
import paymentsRouter from './routes/payments.routes'
import cors from 'cors'
import reviewRouters from './routes/reviews.routes'
import swaggerDocument from '../public/openapi.json'
import productRouter from './routes/products.routes'
import { dailyReport } from './utils/cron/email.services'
import adminRouter from './routes/admin.routes'
import cartRouter from './routes/cart.routes'
import ordersRouter from './routes/orders.routes'

config()
// const swaggerDocument = YAML.load(path.join(__dirname, './openapi.yml'))
// const swaggerDocument = require(path.join(__dirname, '../public/openapi.json'));
dailyReport.start()
const port = process.env.PORT
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
  })
),
  app.use(express.json())
app.use(express.urlencoded({ extended: true }))

databaseService.connect().then(() => {
  databaseService.indexUsers()
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(defaultErrorHandler)

server.listen(port, () => {
  console.log(`Skindora server is running on port ${port}`)
})
