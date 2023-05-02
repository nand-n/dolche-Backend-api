import express, { Request, Response } from "express";

// Define FICO score ranges
const ficoScoreRanges = [
    { min: 300, max: 579, rating: "Poor" },
    { min: 580, max: 669, rating: "Fair" },
    { min: 670, max: 739, rating: "Good" },
    { min: 740, max: 799, rating: "Very Good" },
    { min: 800, max: 850, rating: "Exceptional" },
  ];
  
  // Calculate FICO score based on input factors
  function calculateFicoScore(paymentHistory: number, amountsOwed: number, creditHistoryLength: number, newCredit: number, creditMix: number): number {
    // Apply weights to each factor based on FICO algorithm
    const weightedPaymentHistory = paymentHistory * 0.35;
    const weightedAmountsOwed = amountsOwed * 0.30;
    const weightedCreditHistoryLength = creditHistoryLength * 0.15;
    const weightedNewCredit = newCredit * 0.10;
    const weightedCreditMix = creditMix * 0.10;
  
    // Sum weighted factors to calculate FICO score
    const ficoScore = Math.round(weightedPaymentHistory + weightedAmountsOwed + weightedCreditHistoryLength + weightedNewCredit + weightedCreditMix);
  
    return ficoScore;
  }

export const vaidateFactors=(req:Request ,res:Response ,next:Function)=>{

    const { paymentHistory, amountsOwed, creditHistoryLength, newCredit, creditMix } = req.body;

  // Check that input factors are numbers and within valid ranges
  if (
    !Number.isInteger(paymentHistory) ||
    !Number.isInteger(amountsOwed) ||
    !Number.isInteger(creditHistoryLength) ||
    !Number.isInteger(newCredit) ||
    !Number.isInteger(creditMix) ||
    paymentHistory < 0 ||
    paymentHistory > 100 ||
    amountsOwed < 0 ||
    creditHistoryLength < 0 ||
    newCredit < 0 ||
    creditMix < 0
  ) {
    return res.status(400).json({ error: "Invalid input factors" });
  }

  next();

  }


 export const calculateFico= (req:Request ,res:Response)=>{
    
    const { paymentHistory, amountsOwed, creditHistoryLength, newCredit, creditMix } = req.body;
 // Calculate FICO score based on input factors
 const ficoScore = calculateFicoScore(paymentHistory, amountsOwed, creditHistoryLength, newCredit, creditMix);

 // Find FICO score range based on calculated score
 const ficoScoreRange = ficoScoreRanges.find((range) => range.min <= ficoScore && range.max >= ficoScore);

//  let rating = null;
//  if (ficoScore && ficoScoreRange.rating) { // Add null check here
//    rating = ficoScoreRange.rating.toLowerCase();
//  }
 res.json({
   ficoScore,
//    rating: ficoScoreRange.rating,
 });
  }