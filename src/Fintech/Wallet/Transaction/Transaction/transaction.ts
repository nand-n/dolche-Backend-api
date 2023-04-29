// import prisma from "../../../../db"
// import jwt from 'jsonwebtoken'

// import express, { Request, Response } from 'express';

// interface TransactionRequest {
//     // senderPhone: string;
//     recipientPhone: string;
//     amount: number;
//   }
// export const P2PTransaction = async (req: Request<TransactionRequest, any, TransactionRequest>, res: Response)=>{
//     const { recipientPhone , amount} = req.body

//     const accessToken = req.header('Authorization').replace('Bearer ', '');
    
//     if (!accessToken) {
//       return res.status(401).send({ error: 'Access denied. No token provided.' });
//     }
  
     

//     try {
//         const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
  
//         const user = await prisma.users.findFirst({
//             where: {
//                 id: decoded.id,
//             },
//         })
        
//         if (!user) {
//            return res.status(400).json({
//                 message:"Please Provide a valid token,Sign in again!!"
//             })
//         }

//          // Validate input
//            if (!recipientPhone || !amount || typeof amount !== 'number' || amount <= 0) {
//                  throw new Error('Invalid input');
//              }
        
//         const sender= await prisma.users.findFirst({
//             where:{phone:decoded.phone}
//         })
//         const recipient = await prisma.users.findFirst({
//             where:{phone:recipientPhone}
//         })
//         if(!sender || !recipient){
//             throw new Error("Sender or recipent not found ")
//         }
//         if(sender.balance < amount ){
//             throw new Error("Insufficient Balance!")
//         }

//         const senderId:string=sender.id
//         const recieverId:string=recipient.id

//         const transaction = await prisma.transactions.create({
//             data :{

//                 type: "p2p",
//                 userId : senderId,
//                 agentId :recieverId,
//                 amount :amount,
//                 agent:{
//                     connect:{
//                         id:recieverId
//                     }
//                 },
//                 user:{
//                     connect:{
//                         id:senderId
//                     }
//                 }
//             }
//         })
//         if(!transaction){
//             return res.status(400).json({message:`Transaction Failed , Try Again!`})
//         }
//         const updateSender=  await prisma.users.update({
//             where:{id:sender.id},
//             data:{balance:sender.balance - amount}
//         })
//         if(!updateSender){
//             return res.status(400).json({message:`Something Went Wrong to Update the Sender balance , try again! `})
//         }

//         const updatedRecipent=  await prisma.users.update({
//             where:{id:recipient.id},
//             data:{balance :recipient.balance + amount}
//         })
//         if(!updatedRecipent){
//             return res.status(400).json({message:`Something Went Wrong to Update the Reccipent balance , try again! `})
//         }
//         res.status(200).json({message:`Transaction Successfull : ${transaction}`})
//     } catch (error) {
//         return res.status(500).json({Errormessage:`Error With Internal Sserver or Error With ${error.message}`})
//     }

// }


// export const transactionHistory=async(req,res)=>{
//     try {
//         const transacts = await prisma.transactions.findMany()
//         if (!transacts){
//            return res.status(400).json({message:"Ther is no any transaaction history."})
//         }
//         res.status(200).json({transacts})
//     } catch (error) {
//         return res.status(500).json({message:`Error with Internal server or ${error.message}`})
//     }
// }

import prisma from "../../../../db"
import jwt from 'jsonwebtoken'

import express, { Request, Response } from 'express';

interface TransactionRequest {
    recipientPhone: string;
    amount: number;
}

export const P2PTransaction = async (req: Request<TransactionRequest, any, TransactionRequest>, res: Response)=>{
    const { recipientPhone , amount} = req.body

    const accessToken = req.header('Authorization').replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded:any = jwt.verify(accessToken, process.env.JWT_SECRET);

        const user = await prisma.users.findUnique({
            where: {
                id: decoded.id,
            },
        })

        if (!user) {
            return res.status(400).json({
                message:"Please Provide a valid token,Sign in again!!"
            })
        }

        // Validate input
        if (!recipientPhone || !amount || typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid input');
        }

        const sender = await prisma.users.findUnique({
            where:{id:decoded.id},
            select:{
                balance:true,
            },
        });

        const recipient = await prisma.users.findFirst({
            where:{phone:recipientPhone},
            select:{
                id:true,
                balance:true,
            },
        });
       


        if(!sender || !recipient){
            // throw new Error("Sender or recipient not found ")
            return res.status(400).json({Error:"Sender or recipient not found "})
        }

        if(sender.balance < amount ){
            // throw new Error("Insufficient Balance!")
            return res.status(400).json({Error:"Insufficient Balance!"})
        }

        const transaction = await prisma.transactions.create({
            data :{
                type: "p2p",
                amount :amount,
                userId : decoded.id,
                // user:{connect:{id:decoded.id}}
                // agentId :recipient.id,
            }
        
        })

        if(!transaction){
            return res.status(400).json({message:`Transaction Failed , Try Again!`})
        }

        const updateSender=  await prisma.users.update({
            where:{id:decoded.id},
            data:{balance:sender.balance - amount}
        })

        if(!updateSender){
            return res.status(400).json({message:`Something Went Wrong to Update the Sender balance , try again! `})
        }

        const updatedRecipient=  await prisma.users.update({
            where:{id:recipient.id},
            data:{balance :recipient.balance + amount}
        })

        if(!updatedRecipient){
            return res.status(400).json({message:`Something Went Wrong to Update the Recipient balance , try again! `})
        }

        res.status(200).json({transaction,updateSender,updatedRecipient})

    } catch (error) {
        return res.status(500).json({Errormessage:`Error With Internal Server or Error With ${error.message}`})
    }
}

export const transactionHistory=async(req,res)=>{
    const accessToken = req.header('Authorization').replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded:any = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user= await prisma.users.findUnique({
            where:{id:decoded.id}
        })
        if(!user){
            return res.status(400).json({message:`There is no any user or tokeon expired, try again!`})
        }

        const transacts = await prisma.transactions.findMany({
            where:{
                userId:decoded.id,
            },
            include:{
                user:true,
                agent:true,
            }
        })

        if (!transacts){
            return res.status(400).json({message:"There is no any transaction history."})
        }

        res.status(200).json({transacts})

    } catch (error) {
        return res.status(500).json({message:`Error with Internal Server or ${error.message}`})
    }
}
