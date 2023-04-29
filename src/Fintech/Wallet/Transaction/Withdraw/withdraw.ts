import express from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../../../../db';

export const Withdraw =  async (req, res) => {
  const { amount, userId } = req.body;

  try {
    // Retrieve the user from the database
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    // Check if the user has sufficient balance to make the withdrawal
    if (user.balance < amount) {
      return res.status(400).send('Insufficient funds');
    }

    // Subtract the withdrawal amount from the user's balance
    const newBalance = user.balance - amount;

    // Create a new transaction in the database
    const transaction = await prisma.transactions.create({
      data: {
        type: 'withdrawal',
        amount,
        userId,
      },
    });

    // Update the user's balance in the database
    const updatedUser = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        balance: newBalance,
        transactions: {
          connect: { id: transaction.id },
        },
      },
      include: {
        transactions: true,
      },
    });

    // Publish the updated user to all subscribed clients
    req.app.get('io').to(userId.toString()).emit('userUpdated', updatedUser);

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error withdrawing funds');
  }
}