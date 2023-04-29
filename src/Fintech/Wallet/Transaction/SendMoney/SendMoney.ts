import prisma from "../../../../db";
import jwt from 'jsonwebtoken'

export const SendMoney = async (req, res) => {
    const { amount, phone } = req.body
      const accessToken = req.header('Authorization').replace('Bearer ', '');
    
  if (!accessToken) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id,
        },
    })
    
    if (!user) {
       return res.status(400).json({
            message:"Please Provide a valid token,Sign in again!!"
        })
    }
    
    try {

        //chcek if there is regitered user with the given phone number  
        const existPhone = await prisma.user.findFirst({
            where: {
                phone:phone
            }
        }) 
        if (!existPhone) {
            return res.status(400).json({message:`There is no any user with ${phone} please use registered phone number! `})
        }
        const currentBalance = await prisma.account.findUnique({
            where: {
                id:decoded.id
            }
        })
        const ballance = currentBalance.balance
        const updatedballance = ballance - amount  
        const send = await prisma.account.update({
            where: {
                id: decoded.id,
            
            },
            data: {
                balance:updatedballance    
             }
        })

    } catch (error) {
        
    }
}