import prisma from "../../../db"
import jwt from 'jsonwebtoken'


//To Activate The Equb
export const equbActivate = async (req, res) => {
    const { equbId ,income,EmplymnetStatus ,Debt,legalAgreement ,equbPurpose} = req.body
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
    
   try {
     const activate = await prisma.selectedEqub.create({
        data: {
             equbID: equbId,
             userId: decoded.id,
             emplymnetStatus:EmplymnetStatus,
             debt: Debt,
             income:income,
             legalAgreement:legalAgreement,
             equbPurpose: equbPurpose
         },
         include: {  equb:equbId,user:decoded.id  }
        
       
     })
       if (!activate) {
           return res.status(400).json({message:"Equb Activation Unsucessfull, Try Again!!!"})
       }
       return res.status(200).json({Message:activate})
   } catch (error) {
    return res.status(500).json({ErrorMessage:`Error With Internal Server or ${error.message}`})
   }
    
}

//To add information in order to make analysis based on the information he gives 
export const equbActivationInfo = async (req, res) => {
    const {userId,transactionHistory,spendingHabbit,CreditScore,Income,EmplymnetStatus,Debt , finacialStatments,Collateral,LoanPurpose} = req.body
    // ,DebtToIncomeRatio
    // finacialStatments : If the borrower is a business, you may need to collect financial statements such as income statements,
    //  balance sheets, and cash flow statements to assess their financial health.
    // Collateral : evaluate the value of the collateral and the borrower's equity position.

    try {
        

    } catch (error) {
        return res.status(500).json({message:`Error with internal server or ${error.message}`})
    }
}