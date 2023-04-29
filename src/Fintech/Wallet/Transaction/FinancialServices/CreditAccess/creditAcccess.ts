// Import the Prisma client instance
import prisma from "../../../../../db";

// Define the endpoint handler function for creating a new loan
export const createLoan = async (req, res) => {
  try {
    // Extract the loan details from the request body
    const { amount, userId } = req.body;

    // Validate the loan amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid loan amount' });
    }

    // Define the loan terms
    const facilitationFee = 0.06;
    const penaltyFee = 0.005;
    const facilitationAmount = amount * facilitationFee;
    const penaltyAmount = 0;
    const totalAmount = amount + facilitationAmount + penaltyAmount;

    // Create a new loan record in the database
    const loan = await prisma.loan.create({
      data: {
        amount:amount,
        facilitationFee:facilitationFee,
        penaltyFee:penaltyFee,
        facilitationAmount:facilitationAmount,
        penaltyAmount:penaltyAmount,
        totalAmount:totalAmount,
        userId:userId,
      },
    });

    // Return the new loan record in the response
    return res.status(200).json({ loan });
  } catch (error) {
    // Handle any errors that occur during loan creation
    return res.status(500).json({ error: `Error creating new loan: ${error.message}` });
  }
};

// Define the endpoint handler function for retrieving a loan by ID
export const getLoanById = async (req, res) => {
  try {
    // Extract the loan ID from the request parameters
    const { id } = req.body;

    // Retrieve the loan record from the database
    const loan = await prisma.loan.findUnique({
      where: { id: String(id) },
    });

    // Check if the loan record was found
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Return the loan record in the response
    return res.status(200).json({ loan });
  } catch (error) {
    // Handle any errors that occur during loan retrieval
    return res.status(500).json({ error: `Error retrieving loan: ${error.message}` });
  }
};


