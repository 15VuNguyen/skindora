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

export async function sendMessage(topic: string, key: string, value: any) {
  await producer.send({
    topic,
    messages: [
      {
        key,
        value: JSON.stringify(value)
      }
    ]
  })
}
