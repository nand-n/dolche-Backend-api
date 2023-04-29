import express from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../../../../db';
import jwt from 'jsonwebtoken'
import EventEmitter from 'events';
import socketio from 'socket.io-client';

const eventEmitter = new EventEmitter()

export const Deposite = async (req, res) => {
  const { amount, agentPhone } = req.body;

  const accessToken = req.header('Authorization').replace('Bearer ', '');
    
  if (!accessToken) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    if (!decoded) {
        return res.status(400).json({message:"Error with Authorizing the token!!!!"})
    }

    // Retrieve the user from the database
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if(!user){
      return res.status(404).json({message:`User with ID ${decoded.id} is not Found!`})
    }

    const agent= await prisma.agents.findFirst({
      where:{
        phone:agentPhone
      }
    })
    if(!agent){
      return res.status(400).json({message:`There is no Registerd Agent with ${agentPhone} `})
    }

    const agentGet = await prisma.agents.findUnique({
      where:{
        id:agent.id
      }
    })


    // Add the deposit amount to the user's balance
    const newBalance:number = (user.balance + amount);
    console.log("newBalance",newBalance)
    // Create a new transaction in the database
    const transaction = await prisma.transactions.create({
      data: {
        type: 'deposit',
        amount,
        userId:decoded.id,
        agentId:agent.id
      },
    });

    // Update the user's balance in the database
    const updatedUser = await prisma.users.update({
      where: {
        id: decoded.id,
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

        // Update the Agent's balance in the database
    const newBalanceAgnt:number = (agentGet.balance - amount);

        const updatedAgent = await prisma.agents.update({
          where: {
            id: agentGet.id,
          },
          data: {
            balance: newBalanceAgnt,
            transactions: {
              connect: { id: transaction.id },
            },
          },
          include: {
            transactions: true,
          },
        });

        if(!updatedAgent){
          return res.status(400).json({message:"Something went Wrong , try Again! "})
        }
    // Publish the updated user to all subscribed clients
    // req.app.get('io').to(userId.toString()).emit('userUpdated', updatedUser);
    
    res.status(200).json({updatedUser,updatedAgent});
  } catch (err) {
    console.error(err);
    res.status(500).json({message :`Error depositing funds or error with ${err.message}`});
  }
}

interface Deposit {
  id: number;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  userId: number;
  agentPhoneNumber: string;
}

//another Endpoint
export const DepositeWithEvent=async(req,res)=>{

  const {amount,agentPhoneNumber ,userId} = req.body
  // const userId= req.headers['user-id']
  // const userId = req.body

try {
  
  const agentw= await prisma.agents.findFirst({
    where:{
      phone:agentPhoneNumber
    },
    select:{
      id:true,
      phone:true,
      balance:true
    }
  })

  console.log("agentID : " , agentw.id)

  const deposite = await prisma.deposit.create({
    data:{
      amount:amount,
      status:"PENDING",
      users:{connect:{id:userId}},
      // agents:{connect:{phone:agentPhoneNumber}}
      agents:{connect:{id:agentw.id}}
    }
  })
  if(!deposite){
    return res.status(400).json({
      message:`Error with Creating deposite iniciation on the deposite table.`
    })
  }

  const user = await prisma.users.findUnique({
    where:{
      id:userId
    }
  })
  if(!user){
    return res.status(400).json({
      message:`The User with user id ${userId} is not found!`
    })
  }
  const agent = await prisma.agents.findFirst({
    where:{
      phone:agentPhoneNumber,
    }
  })
  if(!agent){
    return res.status(400).json({
      message:`The User with user id ${agent} is not found!`
    })
  }
    const newBalance:number = (user.balance + amount);
    const newBalanceAgent:number = (agent.balance - amount);


//Update the user's 
  const updateUser = await prisma.users.update({
    where:{
      id:user.id
    },data:{
      balance:newBalance,
    }
  })
  if(!updateUser){
    return res.status(400).json({
      message:`Error with updating ${user.username}'s  balance, Try again!!`
    })
  }
  //Update the user's 
  const updateAgent = await prisma.agents.update({
    where:{
      id:agent.id
    },data:{
      balance:newBalanceAgent,
    }
  })
  if(!updateUser){
    return res.status(400).json({
      message:`Error with updating ${user.username}'s  balance, Try again!!`
    })
  }
  emitDepositeEvent(deposite)

  res.status(200).json({
    message:"Deposte Initiated Successfully",
    data:{deposite}
  })
} catch (error) {
  res.status(500).json({
    message:`An Error occured while processing Your Request or error with ${error.message}`
  })
}

}

function emitDepositeEvent(deposite){
  eventEmitter.emit('deposite',deposite)
}

eventEmitter.on('deposte',async (deposte)=>{
  try {
    const agent= await prisma.agents.findFirst({
      where:{
        phone:deposte.agentPhoneNumber
      }
    })
    if(!agent){
      console.log(`no Agent with ${agent.phone}`)
    }

    const message = `New deposite of ${deposte.amount} initiated by ${deposte.userId}.please Aprove the Deposite after you accepted the cash.`
    //sendSms(agent.phoneNumber ,message)
    await new Promise((resolve) =>{
      const intervalId = setInterval(async()=>{
        const updatedDeposite = await prisma.deposit.findUnique({
          // where:{id:agent.id},
          where:{id:deposte.id},

          select:{status:true}
        })
        if(updatedDeposite.status === 'APPROVED'){
          notifyUserOfDepositeSuccess(updatedDeposite)
          clearInterval(intervalId)
          emitDepositeConfimedEvent(updatedDeposite)
        }
      },5000)
    })
  } catch (error) {
    console.log(error.message)
  }
})

function notifyUserOfDepositeSuccess(deposte){
  // TODO: Notify the user using a push notification or email
}

function emitDepositeConfimedEvent(depositeId){
  // TODO: Emit the deposit confirmed event to the agent
  const socket = socketio('http://localhot:3001')
  socket.on('connect',()=>{
    socket.emit('depostieConfirmed',depositeId.id)
  })
}