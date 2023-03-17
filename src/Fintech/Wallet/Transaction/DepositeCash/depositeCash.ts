import prisma from "../../../../db";
import jwt from 'jsonwebtoken'


export const depositeCash = async (req, res) => {
    const { agentId, amount } = req.body

    try {
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
                message: "Please Provide a valid token,Sign in again!!"
            })
            
        }
        const deposite = await prisma.transaction.create({
            data: {
                agent: agentId,
                userId: user.id,
                amount: amount,
                
            }
        })

        } catch (e) {
        
        }

}