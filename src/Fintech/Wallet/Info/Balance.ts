import jwt from 'jsonwebtoken'
import prisma from '../../../db';

export const Balance = async(req,res)=>{
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
  });
  if(!user){
    return res.status(404).json({message:`User with ID ${decoded.id} is not Found!`})
  }



  console.log(user.balance)
  return res.status(200).json(user.balance)

    } catch (error) {
        return res.status(500).json({ErrorMessage:`Error With internal Server or Error With ${error.messaage}`})
    }
}