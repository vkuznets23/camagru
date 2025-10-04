import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'

//socket.emit() - отправить только отправителю
// socket.broadcast.emit() - отправить всем, кроме отправителя
// io.emit() - отправить всем подключенным
// io.to(room).emit() - отправить всем в комнате
// socket.to(room).emit() - отправить всем в комнате, кроме отправителя

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  // check if socket is already running
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new ServerIO(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin:
          process.env.NODE_ENV === 'production'
            ? process.env.NEXTAUTH_URL
            : 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    })
    res.socket.server.io = io

    // Handle connections
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id)

      // Join user room
      socket.on('join-user-room', (userId: string) => {
        socket.join(`user-${userId}`)
        console.log(`User ${userId} joined their room`)
      })

      // Join chat
      socket.on('join-chat', (chatId: string) => {
        socket.join(`chat-${chatId}`)
        console.log(`User joined chat: ${chatId}`)
      })

      // send message
      socket.on(
        'send-message',
        (data: {
          chatId: string
          message: string
          senderId: string
          senderName: string
          timestamp: number
        }) => {
          // send message to all chat participants
          io.to(`chat-${data.chatId}`).emit('new-message', {
            id: Date.now().toString(),
            chatId: data.chatId,
            message: data.message,
            senderId: data.senderId,
            senderName: data.senderName,
            timestamp: data.timestamp,
          })
          console.log(`Message sent to chat ${data.chatId}:`, data.message)
        }
      )

      // send typing notification
      socket.on(
        'typing',
        (data: { chatId: string; userId: string; isTyping: boolean }) => {
          socket.to(`chat-${data.chatId}`).emit('user-typing', {
            userId: data.userId,
            isTyping: data.isTyping,
          })
        }
      )

      // update online status
      socket.on('user-online', (userId: string) => {
        socket.broadcast.emit('user-status', {
          userId,
          status: 'online',
        })
      })

      // handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
  res.end()
}
