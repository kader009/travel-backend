import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { Message } from '../app/modules/chat/chat.model';

// Store connected users. Map<userId, socketId>
export const connectedUsers = new Map<string, string>();

export const setupSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://trustedge.vercel.app',
      ],
      credentials: true,
    },
  });

  // Middleware for Socket Authentication
  io.use((socket: Socket, next) => {
    try {
      // Token can be sent in handshake auth or headers
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string,
      ) as { userId: string; role: string };

      // Attach user info to socket
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).user.userId;
    console.log(`User connected to socket: ${userId} (${socket.id})`);

    // Store user socket mapping
    connectedUsers.set(userId, socket.id);

    // User joins a room identified by their own userId to receive their private messages
    socket.join(userId);

    // Handle sending a private message
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, content } = data;
        const senderId = userId;

        // Save to DB
        const newMessage = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // Emit only to receiver
        io.to(receiverId).emit('receiveMessage', newMessage);
        
        // Also emit back to sender to confirm
        socket.emit('messageSent', newMessage);

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Could not send message');
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from socket: ${userId}`);
      connectedUsers.delete(userId);
    });
  });

  return io;
};
