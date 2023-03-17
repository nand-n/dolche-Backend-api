import prisma from "../../../db"
import jwt from 'jsonwebtoken'

export const activatedEqubId = async (req, res) => {
    const { activatedEqubId , equbId } = req.body
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
            message:"Please Provide a valid token,Sign in again!!"
        })
    }

        const activatedEqub = await prisma.selectedEqub.findUnique({
        where: {
            id: activatedEqubId
            },
            include:{equb :equbId}
          
    })
    if (!activatedEqub) {
        return res.status(400).json({Message:"Can't find Activated Equb with giiven Id, try again!"})
    }
        
        res.status(200).json({activatedEqub})
    } catch (error) {
        
    }

}