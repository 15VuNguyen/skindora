import { Kafka } from 'kafkajs'
import redisClient from '../redis.services'
import dotenv from 'dotenv'

dotenv.config()

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID ?? '',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
    maxRetryTime: 30000
  },
  connectionTimeout: 30000
})

const consumer = kafka.consumer({
  groupId: process.env.VOUCHER_GROUP_ID ?? '',
  sessionTimeout: 30000,
  heartbeatInterval: 3000
})

export async function startVoucherConsumer() {
  try {
    try {
      await consumer.disconnect()
    } catch (err) {
      console.log('Error in start voucher consumer: ', err)
    }

    await consumer.connect()

    const createdTopic = process.env.VOUCHER_CREATED ?? ''
    const updatedTopic = process.env.VOUCHER_UPDATED ?? ''

    if (!createdTopic) throw new Error('VOUCHER_CREATED env is missing')
    if (!updatedTopic) throw new Error('VOUCHER_UPDATED env is missing')

    await consumer.subscribe({ topic: createdTopic, fromBeginning: true })
    await consumer.subscribe({ topic: updatedTopic, fromBeginning: true })

    console.log(`Subscribed to topics: ${createdTopic}, ${updatedTopic}`)
  } catch (err) {
    console.error('Error connecting/subscribing Kafka:', err)
    setTimeout(() => {
      startVoucherConsumer()
    }, 5000)
    return
  }

  setTimeout(async () => {
    try {
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const raw = message.value?.toString()
            if (!raw) {
              console.warn('Message has no value')
              return
            }

            let voucher
            try {
              voucher = JSON.parse(raw)
              if (typeof voucher === 'string') {
                voucher = JSON.parse(voucher)
              }
            } catch (parseError) {
              console.error('Error parsing voucher message:', parseError)
              return
            }

            const key = process.env.VOUCHER_KEY ?? 'voucher_list'
            const cachedData = await redisClient.get(key)
            let voucherList = cachedData ? JSON.parse(cachedData) : []

            const index = voucherList.findIndex((v: any) => v._id === voucher._id)
            if (index !== -1) {
              voucherList[index] = voucher
            } else {
              voucherList.push(voucher)
            }

            await redisClient.set(key, JSON.stringify(voucherList))
          } catch (err) {
            console.error('Error in voucher eachMessage handler:', err)
          }
        }
      })
    } catch (err) {
      console.error('Error starting consumer run:', err)
      setTimeout(() => {
        console.log('Retrying consumer run')
        startVoucherConsumer()
      }, 5000)
    }
  }, 5000)
}
