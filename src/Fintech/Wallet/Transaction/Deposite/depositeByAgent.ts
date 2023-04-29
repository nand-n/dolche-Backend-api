
import jwt from 'jsonwebtoken'
import prisma from '../../../../db';

export const userDepositeByAgent=async (req,res) => {
    const {userPhone, amount} = req.body
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
    const agent = await prisma.agents.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if(!agent){
      return res.status(404).json({message:`Agent with ID ${decoded.id} is not Found!`})
    }

    const user= await prisma.users.findFirst({
      where:{
        phone:userPhone
      }
    })
    if(!user){
      return res.status(400).json({message:`There is no Registerd User with ${userPhone} `})
    }


    // Add the deposit amount to the user's balance
    const newBalance:number = (user.balance + amount);
    console.log("newBalance",newBalance)
    // Create a new transaction in the database
    const transaction = await prisma.transactions.create({
      data: {
        type: 'deposit',
        amount,
        userId:user.id,
        agentId:decoded.id
      },
    });

    // Update the user's balance in the database
    const updatedUser = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        balance: newBalance,
        transactions: {
          connect: { id: transaction.id },
        },
      },
      include: {
        transactions: true,
      },
    });

        // Update the Agent's balance in the database
    const newBalanceAgnt:number = (agent.balance - amount);

        const updatedAgent = await prisma.agents.update({
          where: {
            id: agent.id,
          },
          data: {
            balance: newBalanceAgnt,
            transactions: {
              connect: { id: transaction.id },
            },
          },
          include: {
            transactions: true,
          },
        });

        if(!updatedAgent){
          return res.status(400).json({message:"Something went Wrong , try Again! "})
        }
    
    res.status(200).json({updatedUser,updatedAgent});


        
    } catch (error) {
      return  res.status(500).json({ErrorMessage:`Error with internal server or error with ${error.message}`})
    }
}