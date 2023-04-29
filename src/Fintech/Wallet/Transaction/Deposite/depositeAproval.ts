import prisma from "../../../../db"

export const depositeApproval= async(req,res)=>{
    try {
        
        const {agentPhoneNumber , status , depositID} = req.body
        const deposit = await prisma.deposit.findUnique({
            where:{id:depositID},
            select:{ 
                id:true,
                amount:true,
                status:true,
                // users:{select:{id:true ,phone:true}},
                // agents:{connect:{id:true ,phone:true}}
                users:true,
                agents:true

            }
        })
        if(!deposit){
            return res.status(400).json({
                message:"Deposite not Found!"
            })
        }
        if(deposit.agents.phone !== agentPhoneNumber) {
            return res.status(403).json({
                message: "You are not Authorized to approve this Deposite!"
            })

        }
        if(deposit.status !=='PENDING'){
            return res.status(400).json({
                message:"This Deposite has already been proccessed"
            })
        }
        let updatedDeposite;
        if(status === 'APPROVED'){
            updatedDeposite = await prisma.deposit.update({
                where:{id:depositID},
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
            const message = `Your Deposite of ${updatedDeposite.amount} has been approved by agent.`
            // sendSms(updatedDeposit.user.phoneNumber, message);

        }else if(status ==='DECLINED'){
            updatedDeposite = await prisma.deposit.update({
                where:{id:depositID},
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
            const message = `Your deposit of ${updatedDeposite.amount} has been declined by the agent`;
           //   sendSms(updatedDeposit.user.phoneNumber, message);
        }else{
            return res.status(400).json({
                messaage:"Invalid Status Provided!"
            })
        }

        emitDepositConfirmedEvent(updatedDeposite.id);

        res.status(200).json({
            messaage:'Deposite Status Updated Sucessfully.',
            data:{deposit : updatedDeposite}
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