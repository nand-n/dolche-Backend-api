// import prisma from "../../../db"

// export const CreateAgentAccount = async (req, res) => {
//     //BranchManager=>Aproved by CEO and they will manage the cashflow of the branch => Agents
//     //When Agents Create Therir accounts they will wait to get aproval from the Branch Managers
//     //Create AgentAcount Using userName, password , phone ,Email, Password,Amount(0), BranchAproval(false)
//     const { email, password, username, phone } = req.body;
//     try {
        
//         const createAgent = await prisma.agent.create({
//             data: {
//                 name: username,
//                 email: email,
//                 password: password,
//                 phone: phone,
//                 amout: "0",
//                 branchaproval:false
                
//             }
//         })
//         if (!createAgent) {
//             return res.status(400).json({message:`Error Creteing Admin , Try Agin!`})
//         }
//         res.status(200).json({message:"Agent Created Sucessfully , wait For The Aproval!"})
//     } catch (e) {
//         return res.status(500).json({ErrorMessage:`Error With Internal Server or ${e.message}`})
//     }
// }

