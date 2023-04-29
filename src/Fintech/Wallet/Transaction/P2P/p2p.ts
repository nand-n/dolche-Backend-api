// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function transferFunds(senderId: string, receiverId: string, amount: number): Promise<void> {
//   const sender = await prisma.users.findUnique({
//     where: {
//       id: senderId,
//     },
//     include: {
//       wallet: true,
//     },
//   });

//   const receiver = await prisma.users.findUnique({
//     where: {
//       id: receiverId,
//     },
//     include: {
//       wallet: true,
//     },
//   });

//   if (!sender) {
//     throw new Error(`User ${senderId} not found`);
//   }

//   if (!receiver) {
//     throw new Error(`User ${receiverId} not found`);
//   }

//   if (sender.wallet.balance < amount) {
//     throw new Error('Insufficient funds');
//   }

//   const transaction = await prisma.transactions.create({
//     data: {
//       amount,
//       sender: {
//         connect: { id: senderId },
//       },
//       receiver: {
//         connect: { id: receiverId },
//       },
//     },
//     include: {
//       sender: true,
//       receiver: true,
//     },
//   });

//   await prisma.users.update({
//     where: {
//       id: senderId,
//     },
//     data: {
//       wallet: {
//         update: {
//           balance: {
//             decrement: amount,
//           },
//         },
//       },
//     },
//   });

//   await prisma.users.update({
//     where: {
//       id: receiverId,
//     },
//     data: {
//       wallet: {
//         update: {
//           balance: {
//             increment: amount,
//           },
//         },
//       },
//     },
//   });

//   console.log(`Transaction ${transaction.id} completed: ${sender.name} sent $${amount} to ${receiver.name}`);
// }