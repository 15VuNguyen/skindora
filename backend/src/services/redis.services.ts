import { createClient } from 'redis'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()
const host: string = process.env.HOST_NAME || 'localhost'
const port: number = Number(process.env.HOST_REDIS_PORT) || 443
const caCertPath = path.resolve(__dirname, '..', '..', 'certs', 'ca.crt') // Adjust '..' based on your project structure

const redisClient = createClient({
  socket: {
    host,
    port,
    servername: host
  },
  password: process.env.HOST_PASSWORD
})

redisClient.on('error', (err) => {
  // console.log('Redis connect error: ', err)
})
;(async () => {
  await redisClient.connect()
  console.log('Connected')
})() // connect redis ngay lập tức

export default redisClient
