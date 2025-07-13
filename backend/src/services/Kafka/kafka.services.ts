import { Kafka, Producer } from 'kafkajs'
import dotenv from 'dotenv'

dotenv.config()

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID ?? '',
  brokers: process.env.KAFKA_BROKERS?.split(',') || []
})

const producer: Producer = kafka.producer()

export async function connectProducer() {
  await producer.connect()
  console.log('Kafka connected')
}

export function waitForKafkaReady(ms = 10000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendMessage(topic: string, key: string, value: string) {
  await producer.send({
    topic,
    messages: [
      {
        key,
        value
      }
    ]
  })
}
