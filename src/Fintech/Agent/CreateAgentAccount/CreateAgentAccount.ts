import prisma from "../../../db"
import { comparePassword, createJWT, hashPassword } from "../../../modules/auth";


export const CreateAgentAccount = async (req, res) => {
    
    const { email, password, username, phone } = req.body;
    // Validate input
if (!email || !password || !phone || !username) {
    return res.status(400).json({ error: "Username , phone , Email and password are required" });
   }
     // Check if phone already exists
   const existingPhone = await prisma.agents.findFirst({
    where: { 
     phone 
     },
   });
     if (existingPhone ) {
    return res.status(400).json({ error: "phone number already exist ,please Use another phone number" });
   }
   // Check if userEmail already exists
   const existingEmail = await prisma.agents.findFirst({
    where: { email },
   });
   if (existingEmail) {
    return res.status(400).json({ error: "Agent Email already exists,please use another" });
   }
   // Check if username already exists
   const existingUsername = await prisma.agents.findFirst({
    where: { name:username },
   });
   
   if (existingUsername) {
    return res.status(400).json({ error: "Agent Name already exists,Try another Agent Name" });
   }
   
    try {
        
        const createAgent = await prisma.agents.create({
            data: {
                name: username,
                email: email,
                password: await hashPassword(password),
                phone: phone,
                balance: 1000
            }
        })
        if (!createAgent) {
            return res.status(400).json({message:`Error Creteing Agent, Try Agin!`})
        }

        const tokens = createJWT(createAgent)

        // res.status(200).json({message:"Agent Created Sucessfully , wait For The Aproval!"})
       return  res.status(200).json({ tokens})
    } catch (e) {
        return res.status(500).json({ErrorMessage:`Error With Internal Server or ${e.message}`})
    }
}

