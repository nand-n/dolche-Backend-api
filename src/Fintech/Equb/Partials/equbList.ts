import prisma from "../../../db"
import jwt from 'jsonwebtoken'
//to send equb list for the clinet app 
export const equbList = async (req, res) => {
    try {
        const equbLIst = await prisma.equb.findMany({})
        if (!equbLIst) {
            return res.status(400).json({message:"There is no Equb or Try Again!!!!"})
        }
        res.status(200).json({equbLIst})
    } catch (error) {
        return res.status(500).json({errorMessage:`Error with internal server or ${error.message}`})
    }
}
// To Create New Equb ---> Can be created only by admin 
// 

export const createEqub = async (req, res) => {
    const { equbName, equbType, equbMonthlyPayment, equbMemberLimit ,equbCretorName , userId,amount} = req.body
       const accessToken = req.header('Authorization').replace('Bearer ', '');
    
  if (!accessToken) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(400).json({message:"Error with Authorizing the token!!!!"})
        }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id,
        },
        select: {
            isAdmin: true
        }
    })
    
    if (!user || !user.isAdmin) {
       return res.status(400).json({
            message:"You cant! , Only admins can access this Route!!!!!"
        })
    } 
        const CreateEqub = await prisma.equb.create({
            data: {
                equbName: equbName,
                equbType: equbType,
                equbMonthlyPayment: equbMonthlyPayment,
                equbMemberLimit: equbMemberLimit,
                equbCretorName: decoded.username,
                userId: decoded.id,
                amount:amount
            }
        })
        if (!CreateEqub) {
            return res.status(400).json({
                message:"Error Creating Equb ,Try Again!!!"
            })
        }
        return res.status(200).json({ CreateEqub })
        
    } catch (error) {
        return res.status(500).json({errorMessage:`Error with internal server or ${error.message}`})
    }
}