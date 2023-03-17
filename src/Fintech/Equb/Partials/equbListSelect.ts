import prisma from "../../../db"

// User Selected Equb Id 
export const equbListSelect = async (req, res) => {
    const { userId, equbId } = req.body
    
    try {
        
        const EqubSelected = await prisma.selectedEqub.create({
            data: {
                userId: userId,
                equbID:equbId
            }
        })


        if (!EqubSelected) {
            return res.status(400).json({message:"Failed to Create The Equb , Try Again"})
        }
        return res.status(200).json({EqubSelected})
    } catch (error) {
        return res.status(500).json({ErrorMessage:`Error With Internal Server or ${error.message}`})
    }
}