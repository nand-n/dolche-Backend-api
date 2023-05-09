import express, { Request, Response } from 'express';
import prisma from '../../db';
import jwt from 'jsonwebtoken'


// Define credit limit endpoint
export const creditLimitCalc= async(req: Request, res: Response) => {
  const { creditLimit, creditUtilization } = req.body;

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
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if(!user){
      return res.status(404).json({message:`User with ID ${decoded.id} is not Found!`})
    }


    const ficoScore= await prisma.ficoScores.findFirst({
      where:{
        userId:user.id
      },
    })
    if(!ficoScore){
      return res.status(400).json({message:"Couldn't find any Credit limit for You."})
    }

    

    let newCreditLimit = 0;

  if (ficoScore.score >= 800 && creditUtilization <= 0.1) {
    newCreditLimit = creditLimit * 2;
  } else if (ficoScore.score >= 750 && creditUtilization <= 0.2) {
    newCreditLimit = creditLimit * 1.5;
  } else if (ficoScore.score >= 700 && creditUtilization <= 0.3) {
    newCreditLimit = creditLimit * 1.2;
  } else if (ficoScore.score >= 650 && creditUtilization <= 0.4) {
    newCreditLimit = creditLimit * 1.1;
  } else if (ficoScore.score >= 600 && creditUtilization <= 0.5) {
    newCreditLimit = creditLimit;
  } else {
    newCreditLimit = creditLimit * 0.9;
  }

  res.json({ creditLimit: newCreditLimit });
  } catch (error) {
  return res.status(500).json({ErrorMessage:`Error With internal server or Error With ${error.message}`})
    
  }
}

// Define FICO score endpoint
export const ficoScoreCalc = async  (req: Request, res: Response) => {
  const { paymentHistory, amountsOwed, creditHistoryLength, newCredit, creditMix , creditLimit} = req.body;
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
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if(!user){
      return res.status(404).json({message:`User with ID ${decoded.id} is not Found!`})
    }

  let ficoScore = 0;

  // Calculate payment history score
  const paymentHistoryScore = paymentHistory * 0.35;

  // Calculate amounts owed score
  const creditUtilization = amountsOwed / creditLimit;
  const amountsOwedScore = (creditUtilization <= 0.3) ? 30 : ((creditUtilization <= 0.5) ? 20 : ((creditUtilization <= 0.75) ? 10 : 0));

  // Calculate credit history length score
  const creditHistoryLengthScore = creditHistoryLength * 0.15;

  // Calculate new credit score
  const newCreditScore = (newCredit === 0) ? 0 : ((newCredit <= 2) ? 10 : 0);

  // Calculate credit mix score
  const creditMixScore = (creditMix === 1) ? 10 : 0;

  // Calculate overall FICO score
  ficoScore =( paymentHistoryScore + amountsOwedScore + creditHistoryLengthScore + newCreditScore + creditMixScore);

  // Return FICO score and rating
  let rating = '';
  if (ficoScore >= 800) {
    rating = 'Exceptional';
  } else if (ficoScore >= 740 && ficoScore < 800) {
    rating = 'Very Good';
  } else if (ficoScore >= 670 && ficoScore < 740) {
    rating = 'Good';
  } else if (ficoScore >= 580 && ficoScore < 670) {
    rating = 'Fair';
  } else {
    rating = 'Poor';
  }

  const ficoScoreDb = await prisma.ficoScores.create({
    data:{
      score:ficoScore*10,
      status:rating,
      userId:user.id

    },include:{
      users:true

    }
  })
  if(!ficoScoreDb){
    return res.status(400).json({message:"Error Saving Credit score , Try Again!!"})
  }

  res.status(200).json({ficoScoreDb });
 } catch (error) {
  return res.status(500).json({ErrorMessage:`Error With internal server or Error With ${error.message}`})
 }
}

