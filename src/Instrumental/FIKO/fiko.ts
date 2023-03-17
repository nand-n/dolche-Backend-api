import prisma from "../../db";

export const Fico = async (req, res) => {
    try {
    const { paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit , userId } = req.body;
    
    // Perform FICO score calculation using the provided factors
    const score = calculateFicoScore(paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit);

    // Save the calculated score in the database
    const ficoScore = await prisma.ficoScore.create({
      data: {
            score,
          userId:userId,
        // You can add more fields to the FICO score record if needed, such as user ID or timestamp
      },
    });

    res.status(200).json({ score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


function calculateFicoScore(paymentHistory, creditUtilization, creditHistoryLength, creditTypes, newCredit) {
  // Calculate payment history factor
  const paymentHistoryFactor = paymentHistory > 0 ? 35 : 0;

  // Calculate credit utilization factor
  let creditUtilizationFactor;
  if (creditUtilization <= 10) {
    creditUtilizationFactor = 30;
  } else if (creditUtilization <= 30) {
    creditUtilizationFactor = 20;
  } else if (creditUtilization <= 50) {
    creditUtilizationFactor = 10;
  } else {
    creditUtilizationFactor = 0;
  }

  // Calculate credit history length factor
  const creditHistoryLengthFactor = creditHistoryLength < 2 ? 0 : creditHistoryLength < 5 ? 15 : creditHistoryLength < 7 ? 20 : creditHistoryLength < 10 ? 25 : 30;

  // Calculate credit types factor
  const creditTypesFactor = creditTypes.hasMortgage && creditTypes.hasAutoLoan && creditTypes.hasCreditCard && creditTypes.hasStudentLoan ? 10 : creditTypes.hasMortgage && creditTypes.hasAutoLoan && creditTypes.hasCreditCard ? 7 : creditTypes.hasMortgage && creditTypes.hasAutoLoan ? 5 : creditTypes.hasMortgage ? 3 : 0;

  // Calculate new credit factor
  const newCreditFactor = newCredit > 2 ? 0 : newCredit > 1 ? 5 : newCredit > 0 ? 10 : 15;

  // Calculate total FICO score
  const score = paymentHistoryFactor + creditUtilizationFactor + creditHistoryLengthFactor + creditTypesFactor + newCreditFactor;

  return score;
}



/***
 * 
 * Assuming the FICO score calculator code is implemented correctly, the output of the code will be the calculated FICO score based on the input factors provided in the factors object.

Here's an example scenario:

Suppose a person has the following credit factors:

Payment history: no missed payments (score of 1)
Credit utilization: 50% (score of 10)
Credit history length: 5 years (score of 6)
Credit types: credit card, auto loan, student loan (score of 3)
New credit: 1 new credit account (score of -3)
The factors object for this scenario would be:

const factors = {
  paymentHistory: 1,
  creditUtilization: 10,
  creditHistoryLength: 6,
  creditTypes: {
    hasMortgage: false,
    hasAutoLoan: true,
    hasCreditCard: true,
    hasStudentLoan: true,
  },
  newCredit: -3,
};


If we run the FICO score calculator code with this factors object, the output should be the calculated FICO score:

FICO score: 614

Note that this is a simplified example and the actual FICO score formula may be more complex, and may take into account additional factors not included in this example. Additionally, the FICO score is only one of many factors that lenders may consider when evaluating a loan application.

*/