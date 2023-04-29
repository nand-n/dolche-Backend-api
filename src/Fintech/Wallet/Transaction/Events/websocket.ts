import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const io = new Server();

io.on('connection', (socket: Socket) => {
  console.log('Client connected');

  socket.on('subscribe', (userId: string) => {
    console.log(`Subscribing to updates for user ${userId}`);
    socket.join(userId);
  });

  socket.on('unsubscribe', (userId: string) => {
    console.log(`Unsubscribing from updates for user ${userId}`);
    socket.leave(userId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

export async function publishUserUpdate(userId: string) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        transactions: true,
      },
    });

    if (!user) {
      console.log(`User ${userId} not found`);
      return;
    }

    console.log(`Publishing update for user ${userId}`);
    io.to(userId).emit('userUpdated', user);
  } catch (err) {
    console.error(err);
  }
}