import prisma from "../../../db";
import jwt from 'jsonwebtoken'


export const userInfo=async(req,res)=>{
    try {
        const accessToken = req.header('Authorization').replace('Bearer ', '');
    
        if (!accessToken) {
          return res.status(401).send({ error: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(400).json({message:"Error with Authorizing the token!!!!"})
        }
      
        // Retrieve the user from the database
        const user = await prisma.users.findUnique({
          where: {
            id: decoded.id,
          },
          select:{
            id:true,
            phone:true,
            username:true,
            balance:true,
            email:true,
          }
        });
        if(!user){
          return res.status(404).json({message:`User with ID ${decoded.id} is not Found!`})
        }
        res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ServerError:`Error With internal server or Error Wirh ${error.message}`})
    }
}