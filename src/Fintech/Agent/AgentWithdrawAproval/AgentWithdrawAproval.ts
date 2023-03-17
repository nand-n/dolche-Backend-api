// import prisma from "../../../db"

// export const AgentWithdrawAproval = async (req, res) => {
//     //Signed in Agent Can Aprove user Withdrawalby user id 
//     const { userId, transactionId } = req.body
//     try {
//         const aproveWithdraw = await prisma.withdraw.findUnique({
//         where: {
//             transactionId:transactionId
//         }
//     })
//         if(!aproveWithdraw) {
//         return res.status(400).json({message:`Error to find the transaction with transactionId : ${transactionId}`})
//         }
        
    
        
//     } catch (error) {
        
//     }
// }