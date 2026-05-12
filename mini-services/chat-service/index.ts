import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

// ============================================================
// Types & Interfaces
// ============================================================

interface OnlineUser {
  userId: string
  username: string
  role: 'warga' | 'admin' | 'kepala_desa'
  socketId: string
  connectedAt: Date
}

interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  senderRole: string
  message: string
  timestamp: Date
}

interface NotificationPayload {
  id: string
  userId?: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
}

interface TypingPayload {
  roomId: string
  senderId: string
  senderName: string
}

// ============================================================
// In-Memory State
// ============================================================

const onlineUsers = new Map<string, OnlineUser>()
const roomMembers = new Map<string, Set<string>>() // roomId -> Set<socketId>
const typingUsers = new Map<string, Map<string, TypingPayload>>() // roomId -> (senderId -> TypingPayload)

// ============================================================
// Helpers
// ============================================================

const generateId = (): string => Math.random().toString(36).substr(2, 12)

const getRoomMemberSocketIds = (roomId: string): Set<string> => {
  if (!roomMembers.has(roomId)) {
    roomMembers.set(roomId, new Set())
  }
  return roomMembers.get(roomId)!
}

const removeUserFromAllRooms = (socketId: string): void => {
  for (const [roomId, members] of roomMembers.entries()) {
    if (members.has(socketId)) {
      members.delete(socketId)
      // Clean up empty rooms
      if (members.size === 0) {
        roomMembers.delete(roomId)
        typingUsers.delete(roomId)
      }
    }
  }
}

// ============================================================
// Server Setup
// ============================================================

const httpServer = createServer()
const io = new Server(httpServer, {
  // DO NOT change the path, it is used by Caddy to forward the request to the correct port
  path: '/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// ============================================================
// Socket Event Handlers
// ============================================================

io.on('connection', (socket: Socket) => {
  console.log(`[CONNECT] Socket connected: ${socket.id}`)

  // ----------------------------------------------------------
  // 1. User Authentication / Registration on connect
  // ----------------------------------------------------------
  socket.on(
    'authenticate',
    (data: { userId: string; username: string; role: 'warga' | 'admin' | 'kepala_desa' }) => {
      try {
        const { userId, username, role } = data

        if (!userId || !username || !role) {
          socket.emit('error', { message: 'userId, username, and role are required' })
          return
        }

        // Remove previous socket mapping for this userId if exists
        for (const [sid, user] of onlineUsers.entries()) {
          if (user.userId === userId) {
            onlineUsers.delete(sid)
          }
        }

        const onlineUser: OnlineUser = {
          userId,
          username,
          role,
          socketId: socket.id,
          connectedAt: new Date(),
        }

        onlineUsers.set(socket.id, onlineUser)

        // Notify all clients about the updated online user list
        io.emit('online-users-updated', { users: getOnlineUsersList() })

        // Auto-join admin users to the admin notification room
        if (role === 'admin' || role === 'kepala_desa') {
          socket.join('admins')
          console.log(`[AUTH] Admin user "${username}" (${role}) joined admins room`)
        }

        console.log(
          `[AUTH] User authenticated: ${username} (${role}) [userId=${userId}, socketId=${socket.id}]`
        )

        socket.emit('authenticated', {
          success: true,
          user: onlineUser,
        })
      } catch (error) {
        console.error('[AUTH ERROR]', error)
        socket.emit('error', { message: 'Authentication failed' })
      }
    }
  )

  // ----------------------------------------------------------
  // 2. Join a Chat Room
  // ----------------------------------------------------------
  socket.on('join-room', (data: { roomId: string }) => {
    try {
      const { roomId } = data
      if (!roomId) {
        socket.emit('error', { message: 'roomId is required' })
        return
      }

      const user = onlineUsers.get(socket.id)
      if (!user) {
        socket.emit('error', { message: 'Please authenticate first' })
        return
      }

      socket.join(roomId)
      const members = getRoomMemberSocketIds(roomId)
      members.add(socket.id)

      // Clear any stale typing status from this user in the room
      const roomTyping = typingUsers.get(roomId)
      if (roomTyping) {
        roomTyping.delete(user.userId)
        if (roomTyping.size === 0) {
          typingUsers.delete(roomId)
        }
      }

      // Notify room participants
      socket.to(roomId).emit('user-joined-room', {
        roomId,
        user: { userId: user.userId, username: user.username, role: user.role },
      })

      // Send room member list to the joiner
      const memberList: Array<{ userId: string; username: string; role: string }> = []
      for (const sid of members) {
        const u = onlineUsers.get(sid)
        if (u) {
          memberList.push({ userId: u.userId, username: u.username, role: u.role })
        }
      }
      socket.emit('room-members', { roomId, members: memberList })

      console.log(`[ROOM] ${user.username} joined room: ${roomId} (members: ${members.size})`)
    } catch (error) {
      console.error('[JOIN-ROOM ERROR]', error)
      socket.emit('error', { message: 'Failed to join room' })
    }
  })

  // ----------------------------------------------------------
  // 3. Leave a Chat Room
  // ----------------------------------------------------------
  socket.on('leave-room', (data: { roomId: string }) => {
    try {
      const { roomId } = data
      if (!roomId) {
        socket.emit('error', { message: 'roomId is required' })
        return
      }

      const user = onlineUsers.get(socket.id)
      if (!user) return

      socket.leave(roomId)
      const members = getRoomMemberSocketIds(roomId)
      members.delete(socket.id)

      // Remove typing status for this user
      const roomTyping = typingUsers.get(roomId)
      if (roomTyping) {
        roomTyping.delete(user.userId)
        // Broadcast updated typing list
        const remainingTyping = Array.from(roomTyping.values())
        io.to(roomId).emit('typing-update', { roomId, typingUsers: remainingTyping })
      }

      // Notify room participants
      socket.to(roomId).emit('user-left-room', {
        roomId,
        user: { userId: user.userId, username: user.username, role: user.role },
      })

      // Clean up empty rooms
      if (members.size === 0) {
        roomMembers.delete(roomId)
        typingUsers.delete(roomId)
      }

      console.log(`[ROOM] ${user.username} left room: ${roomId}`)
    } catch (error) {
      console.error('[LEAVE-ROOM ERROR]', error)
      socket.emit('error', { message: 'Failed to leave room' })
    }
  })

  // ----------------------------------------------------------
  // 4. Send Message
  // ----------------------------------------------------------
  socket.on(
    'send-message',
    (data: { roomId: string; senderId: string; message: string }) => {
      try {
        const { roomId, senderId, message } = data

        if (!roomId || !senderId || !message) {
          socket.emit('error', { message: 'roomId, senderId, and message are required' })
          return
        }

        const user = onlineUsers.get(socket.id)
        if (!user) {
          socket.emit('error', { message: 'Please authenticate first' })
          return
        }

        // Verify the sender matches the authenticated user
        if (user.userId !== senderId) {
          socket.emit('error', { message: 'Sender ID does not match authenticated user' })
          return
        }

        // Clear typing status for this sender in the room
        const roomTyping = typingUsers.get(roomId)
        if (roomTyping) {
          roomTyping.delete(senderId)
          const remainingTyping = Array.from(roomTyping.values())
          io.to(roomId).emit('typing-update', { roomId, typingUsers: remainingTyping })
        }

        const chatMessage: ChatMessage = {
          id: generateId(),
          roomId,
          senderId,
          senderName: user.username,
          senderRole: user.role,
          message,
          timestamp: new Date(),
        }

        // Broadcast to everyone in the room (including sender for confirmation)
        io.to(roomId).emit('new-message', chatMessage)

        console.log(
          `[MSG] ${user.username} in ${roomId}: ${message.substring(0, 80)}${message.length > 80 ? '...' : ''}`
        )
      } catch (error) {
        console.error('[SEND-MESSAGE ERROR]', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    }
  )

  // ----------------------------------------------------------
  // 5. Typing Indicator
  // ----------------------------------------------------------
  socket.on('typing', (data: { roomId: string; senderId: string; senderName: string }) => {
    try {
      const { roomId, senderId, senderName } = data
      if (!roomId || !senderId) return

      const user = onlineUsers.get(socket.id)
      if (!user || user.userId !== senderId) return

      if (!typingUsers.has(roomId)) {
        typingUsers.set(roomId, new Map())
      }
      typingUsers.get(roomId)!.set(senderId, {
        roomId,
        senderId,
        senderName: senderName || user.username,
      })

      // Broadcast typing status to others in the room
      const typingList = Array.from(typingUsers.get(roomId)!.values())
      socket.to(roomId).emit('typing-update', { roomId, typingUsers: typingList })
    } catch (error) {
      console.error('[TYPING ERROR]', error)
    }
  })

  // ----------------------------------------------------------
  // 6. Stop Typing
  // ----------------------------------------------------------
  socket.on('stop-typing', (data: { roomId: string; senderId: string }) => {
    try {
      const { roomId, senderId } = data
      if (!roomId || !senderId) return

      const roomTyping = typingUsers.get(roomId)
      if (roomTyping && roomTyping.has(senderId)) {
        roomTyping.delete(senderId)

        const typingList = Array.from(roomTyping.values())
        io.to(roomId).emit('typing-update', { roomId, typingUsers: typingList })
      }
    } catch (error) {
      console.error('[STOP-TYPING ERROR]', error)
    }
  })

  // ----------------------------------------------------------
  // 7. Push Notification
  // ----------------------------------------------------------
  socket.on(
    'notification',
    (data: { userId?: string; title: string; message: string; type: 'info' | 'warning' | 'success' | 'error'; broadcast?: boolean }) => {
      try {
        const { userId, title, message, type, broadcast } = data

        if (!title || !message || !type) {
          socket.emit('error', { message: 'title, message, and type are required for notifications' })
          return
        }

        const notification: NotificationPayload = {
          id: generateId(),
          userId,
          title,
          message,
          type,
          timestamp: new Date(),
        }

        if (broadcast) {
          // Broadcast to all connected clients
          io.emit('new-notification', notification)
          console.log(`[NOTIF] Broadcast: ${title}`)
        } else if (userId) {
          // Send to a specific user
          let targetSocketId: string | null = null
          for (const [sid, u] of onlineUsers.entries()) {
            if (u.userId === userId) {
              targetSocketId = sid
              break
            }
          }

          if (targetSocketId) {
            io.to(targetSocketId).emit('new-notification', notification)
            console.log(`[NOTIF] Sent to user ${userId}: ${title}`)
          } else {
            console.log(`[NOTIF] User ${userId} is offline, notification not delivered in real-time`)
            // Could store in DB for later retrieval
          }
        } else {
          // If no userId and not broadcast, send to all admins
          io.to('admins').emit('new-notification', notification)
          console.log(`[NOTIF] Sent to all admins: ${title}`)
        }
      } catch (error) {
        console.error('[NOTIFICATION ERROR]', error)
        socket.emit('error', { message: 'Failed to send notification' })
      }
    }
  )

  // ----------------------------------------------------------
  // 8. Get Online Users
  // ----------------------------------------------------------
  socket.on('get-online-users', () => {
    try {
      socket.emit('online-users-list', { users: getOnlineUsersList() })
    } catch (error) {
      console.error('[GET-ONLINE-USERS ERROR]', error)
      socket.emit('error', { message: 'Failed to get online users' })
    }
  })

  // ----------------------------------------------------------
  // Disconnect
  // ----------------------------------------------------------
  socket.on('disconnect', (reason) => {
    try {
      const user = onlineUsers.get(socket.id)

      if (user) {
        console.log(
          `[DISCONNECT] ${user.username} (${user.role}) disconnected: ${reason}`
        )

        // Remove user from all rooms
        removeUserFromAllRooms(socket.id)

        // Remove from online users
        onlineUsers.delete(socket.id)

        // Broadcast updated online users list
        io.emit('online-users-updated', { users: getOnlineUsersList() })
      } else {
        console.log(`[DISCONNECT] Unknown socket disconnected: ${socket.id} (${reason})`)
      }
    } catch (error) {
      console.error('[DISCONNECT ERROR]', error)
    }
  })

  // ----------------------------------------------------------
  // Socket Error
  // ----------------------------------------------------------
  socket.on('error', (error) => {
    console.error(`[SOCKET ERROR] Socket ${socket.id}:`, error)
  })
})

// ============================================================
// Helper: Get Online Users List (deduplicated by userId)
// ============================================================

const getOnlineUsersList = (): Array<{
  userId: string
  username: string
  role: string
  connectedAt: string
}> => {
  const seen = new Set<string>()
  const result: Array<{
    userId: string
    username: string
    role: string
    connectedAt: string
  }> = []

  for (const user of onlineUsers.values()) {
    if (!seen.has(user.userId)) {
      seen.add(user.userId)
      result.push({
        userId: user.userId,
        username: user.username,
        role: user.role,
        connectedAt: user.connectedAt.toISOString(),
      })
    }
  }

  return result
}

// ============================================================
// Start Server
// ============================================================

const PORT = 3003

httpServer.listen(PORT, () => {
  console.log(`============================================`)
  console.log(`  Chat WebSocket Service`)
  console.log(`  Running on port: ${PORT}`)
  console.log(`  Ready for connections...`)
  console.log(`============================================`)
})

// ============================================================
// Graceful Shutdown
// ============================================================

const gracefulShutdown = (signal: string) => {
  console.log(`\n[SHUTDOWN] Received ${signal}, closing server...`)

  // Notify all connected clients
  io.emit('server-shutting-down', {
    message: 'Server is shutting down for maintenance',
    timestamp: new Date().toISOString(),
  })

  io.disconnectSockets(true)

  httpServer.close(() => {
    console.log('[SHUTDOWN] Chat WebSocket Service closed')
    process.exit(0)
  })

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('[SHUTDOWN] Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
