import prisma from "../../../../db"
import jwt from 'jsonwebtoken'

export const WithdrawApproval= async(req,res)=>{


    const accessToken = req.header('Authorization').replace('Bearer ', '');
      
    if (!accessToken) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }
    try {
        
        const { code , status } = req.body

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(400).json({message:"Error with Authorizing the token!!!!"})
        }
      
        // Retrieve the user from the database
        const agent = await prisma.agents.findUnique({
          where: {
            id: decoded.id,
          },
        });
        if(!agent){
          return res.status(404).json({message:`User with ID ${agent.id} is not Found!`})
        }

        const withdraw = await prisma.withdraw.findFirst({
            where:{code:code},
            select:{ 
                id:true,
                amount:true,
                status:true,
                users:true,
                agents:true,
                code:true

            }
        })
        if(!withdraw){
            return res.status(400).json({
                message:"withdraw not Found!"
            })
        }
        if( withdraw.agents.phone !== agent.phone ) {
            return res.status(403).json({
                message: "You are not Authorized to approve this Deposite!"
            })

        }
        if(withdraw.status !=='PENDING'){
            return res.status(400).json({
                message:"This Deposite has already been proccessed"
            })
        }
        let updatedWithdraw;
        if(status === 'APPROVED'){
            // sendSms(updatedDeposit.user.phoneNumber, message);
            const newBalance:number = (withdraw.users.balance - withdraw.amount);
            const newBalanceAgent:number = (agent.balance + withdraw.amount);

 // Check if the user has sufficient balance to make the withdrawal
   if (withdraw.users.balance < withdraw.amount) {
    return res.status(400).send('Insufficient funds!');
    }



        //Update the user's 
const updateUser = await prisma.users.update({
where:{
  id:withdraw.users.id
},data:{
  balance:newBalance,
}
})
if(!updateUser){
return res.status(400).json({
  message:`Error with updating the users balance, Try again!!`
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
if(!updateAgent){
return res.status(400).json({
  message:`Error with updating the Agent's balance, Try again!!`
})
}
            updatedWithdraw = await prisma.withdraw.update({
                where:{id:withdraw.id},
                data:{
                    status:'APPROVED',
                },
                select:{
                    id: true,
                    amount: true,
                    status: true,
                    // users: { connect: { id: true, phone: true } },
                    // agents: { connect: { id: true, phone: true } },
                    users:true,
                    agents:true
                }
            }) 
            // const message = `Your Deposite of ${updatedWithdraw.amount} has been approved by agent.`

            if(!updatedWithdraw){
                return res.status(400).json({message:"Error with Updating Withdraw Status"})
            }


        }else if(status ==='DECLINED'){
            updatedWithdraw = await prisma.withdraw.update({
                where:{id:withdraw.id},
                data:{status:'DECLINED'},
                select: {
                    id: true,
                    amount: true,
                    status: true,
                    // users: { connect: { id: true, phone: true } },
                    // agents: { connect: { id: true, phone: true } },
                    users:true,
                    agents:true
                  },
            })
            
            const message = `Your deposit of ${updatedWithdraw.amount} has been declined by the agent`;
            if(!updatedWithdraw){
                return res.status(400).json({message:"Error with Declining the Withdrawal "})
            }
           //   sendSms(updatedDeposit.user.phoneNumber, message);
        }else{
            return res.status(400).json({
                messaage:"Invalid Status Provided!"
            })
        }

        emitDepositConfirmedEvent(updatedWithdraw.id);

        res.status(200).json({
            messaage:'Deposite Status Updated Sucessfully.',
            data:{deposit : updatedWithdraw}
        })


    } catch (error) {
        res.status(500).json({
            message:`An Error Occured while Processing you request or Error With => ${error.message}`
        })
        
    }
}

import { EventEmitter } from 'events';

function emitDepositConfirmedEvent(depositId: number) {
    const eventPayload = { id: depositId };
    const eventName = 'deposit_confirmed';
    const eventEmitter = new EventEmitter(); // or use an existing event emitter instance
  
    // Emit the event with the payload
    eventEmitter.emit(eventName, eventPayload);
  }