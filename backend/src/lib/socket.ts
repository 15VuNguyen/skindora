import { Server, Socket } from 'socket.io'
import http from 'http'
import express, { Application } from 'express'
import { config } from 'dotenv'
config()

const app: Application = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL as string, 'http://localhost:5173']
  }
})

// interface UserSocketMap {
//   [userId: string]: string
// }

const userSocketMap: UserSocketMap = {}

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId]
}

io.on('connection', (socket: Socket) => {
  console.log('User connected with id:', socket.id)

  const userId = socket.handshake.query.userId as string

  if (userId) {
    userSocketMap[userId] = socket.id;
    (socket as any).userId = userId
  }

  io.emit('getOnlineUser', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    const disconnectedUserId = (socket as any).userId
    console.log('User disconnected with id:', socket.id)

    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId]
      io.emit('getOnlineUser', Object.keys(userSocketMap))
    }
  })
})

export { io, server, app }
