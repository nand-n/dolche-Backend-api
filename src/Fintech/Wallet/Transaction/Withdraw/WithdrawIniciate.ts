import express from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../../../../db';
import jwt from 'jsonwebtoken'
import EventEmitter from 'events';
import socketio from 'socket.io-client';

const eventEmitter = new EventEmitter()

interface Deposit {
  id: number;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  userId: number;
  agentPhoneNumber: string;
}

//another Endpoint
export const WithdrawWithEvent=async(req,res)=>{

  const {amount,agentPhoneNumber ,} = req.body

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
    return res.status(404).json({message:`User with ID ${user.id} is not Found!`})
  }
  
  const agent= await prisma.agents.findFirst({
    where:{
      phone:agentPhoneNumber
    },
    select:{
      id:true,
      phone:true,
      balance:true,
      name:true
      // email:true,
    }
  })
  if(!agent){
    return res.status(400).json({ message:`The Agent with Agent Phone : ${agentPhoneNumber} is not found!`})
  }

  // console.log("agentID : " , agentw.id)
  // const randomGenerated = Math.random()
   // Check if the user has sufficient balance to make the withdrawal
   if (user.balance < amount) {
    return res.status(400).send('Insufficient funds!');
  }
  const randomNum = Math.floor(Math.random() * 900000) + 100000;

  const withdraw = await prisma.withdraw.create({
    data:{
      amount:amount,
      status:"PENDING",
      code:randomNum,
      users:{connect:{id:user.id}},
      agents:{connect:{id:agent.id}}
    }
  })
  if(!withdraw){
    return res.status(400).json({
      message:`Error with Creating withdraw initiation on the withdraw table.`
    })
  }
//     const newBalance:number = (user.balance - amount);
//     const newBalanceAgent:number = (agent.balance + amount);


// //Update the user's 
//   const updateUser = await prisma.users.update({
//     where:{
//       id:user.id
//     },data:{
//       balance:newBalance,
//     }
//   })
//   if(!updateUser){
//     return res.status(400).json({
//       message:`Error with updating ${user.username}'s  balance, Try again!!`
//     })
//   }
//   //Update the user's 
//   const updateAgent = await prisma.agents.update({
//     where:{
//       id:agent.id
//     },data:{
//       balance:newBalanceAgent,
//     }
//   })
//   if(!updateUser){
//     return res.status(400).json({
//       message:`Error with updating ${user.username}'s  balance, Try again!!`
//     })
//   }
  emitDepositeEvent(withdraw)

  res.status(200).json({
    message:`Withdraw Initiated Successfully! USE Code ${randomNum} and give it to Agent ${agent.name}`,
    data:{withdraw}
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