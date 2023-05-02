// import prisma from "../../db";

// export const ficoCalculator = async (req, res) => {
    
//   // Define the FICO score calculation function
// function calculateFicoScore(paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit) {
//   // Define the scoring ranges for each factor
//   const paymentHistoryRanges = [0, 1, 2, 3, 4, 5];
//   const creditUtilizationRanges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
//   const creditHistoryLengthRanges = [0, 6, 12, 24, 36, 48, 60, 72, 84, 96, 120];
//   const creditTypesScores = {
//     hasMortgage: 2,
//     hasAutoLoan: 2,
//     hasCreditCard: 1,
//     hasStudentLoan: 1,
//   };
//   const newCreditRanges = [0, -1, -2, -3, -4, -5];

//   // Calculate the score for each factor based on the provided values
//   const paymentHistoryScore = paymentHistoryRanges[paymentHistory];
//   const creditUtilizationScore = creditUtilizationRanges.findIndex((range) => creditUtilization <= range);
//   const creditHistoryLengthScore = creditHistoryLengthRanges.findIndex((range) => creditHistoryLength >= range);
//   const creditTypesScore = Object.entries(creditTypesScores).reduce(
//     (total, [type, score]) => total + (creditTypes[type] ? score : 0),
//     0
//   );
//   const newCreditScore = newCreditRanges.findIndex((range) => newCredit <= range);

//   // Calculate the total score by summing the scores for each factor
//   const totalScore =
//     paymentHistoryScore +
//     creditUtilizationScore +
//     creditHistoryLengthScore +
//     creditTypesScore +
//     newCreditScore;

//   // Map the total score to the FICO score range (300-850)
//   const ficoScore = Math.max(300, Math.min(850, totalScore * 10));

//   // Return the FICO score
//   return ficoScore;
// }
//   try {
//     // Define a route for calculating the FICO score
//     const { paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit, userId } = req.body;
   
//     if (!paymentHistory || !creditUtilization || !creditHistoryLength || !creditTypes || !newCredit || !userId) {
//       return res.status(400).json({message :"Please provide the required datas"})
//     }

//   // Calculate the FICO score using the provided factors
//   const score = calculateFicoScore(paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit);
 
//     if (!score) {
//       return res.status(400).json({message:"wtf score 1"})
//     }
//     console.log(score)
//   // Save the FICO score to the database
//     const ficoScore = await prisma.ficoScore.create({
//         data: {
//             score: score.toString(),
//         userId: userId
//             // userId: { connect: { id: userId } }
//         }
//     });
//      if (!ficoScore) {
//        return res.status(400).json({message:"Can not calculate the fico score , try Again!!!"})
//      }
    

//   // Return the calculated FICO score
//    res.json({ Fico_Score:ficoScore.score });
//    } catch (error) {
//     return res.status(500).json({ErrorMessage:`Error with internal server or ${error.message}`})
//    }

// }


import prisma from "../../db";

const calculateFicoScore = (paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit) => {
  const paymentHistoryRanges = [0, 1, 2, 3, 4, 5];
  const creditUtilizationRanges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const creditHistoryLengthRanges = [0, 6, 12, 24, 36, 48, 60, 72, 84, 96, 120];
  const creditTypesScores = {
    hasMortgage: 2,
    hasAutoLoan: 2,
    hasCreditCard: 1,
    hasStudentLoan: 1,
  };
  const newCreditRanges = [0, -1, -2, -3, -4, -5];

  const paymentHistoryScore = paymentHistoryRanges[paymentHistory];
  const creditUtilizationScore = creditUtilizationRanges.findIndex((range) => creditUtilization <= range);
  const creditHistoryLengthScore = creditHistoryLengthRanges.findIndex((range) => creditHistoryLength >= range);
  const creditTypesScore = Object.entries(creditTypesScores).reduce(
    (total, [type, score]) => total + (creditTypes[type] ? score : 0),
    0
  );
  const newCreditScore = newCreditRanges.findIndex((range) => newCredit <= range);

  // const totalScore =
  //   paymentHistoryScore +
  //   creditUtilizationScore +
  //   creditHistoryLengthScore +
  //   creditTypesScore +
  //   newCreditScore;
   const totalScore =
    3 +
    70 +
    48 +
    4 +
    -2;

  const ficoScore = Math.max(300, Math.min(850, totalScore * 10));

  return ficoScore;
}

export const ficoCalculator = async (req, res) => {
  try {
    // Extract the required data from the request body
    const { paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit, userId } = req.body;

    // Check if all the required data is present in the request body
    if (!paymentHistory || !creditUtilization || !creditHistoryLength || !creditTypes || !newCredit || !userId) {
      return res.status(400).json({ message: "Please provide all the required data" });
    }

    // Calculate the FICO score
    const ficoScore = calculateFicoScore(paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit);

    // Save the FICO score to the database
    // const savedFicoScore = await prisma.ficoScores.create({
    //   data: {
    //     score: ficoScore,
    //     // users: {
    //     //   connect: {
    //     //     id: userId,
    //     //   },
    //     // },
    //   },
    // });

    // Check if the FICO score was successfully saved
    // if (!savedFicoScore) {
    //   return res.status(500).json({ message: "Failed to save FICO score" });
    // }

  // Return the calculated FICO score
   res.json({ Fico_Score:ficoScore});
   } catch (error) {
    return res.status(500).json({ErrorMessage:`Error with internal server or ${error.message}`})
   }

}
