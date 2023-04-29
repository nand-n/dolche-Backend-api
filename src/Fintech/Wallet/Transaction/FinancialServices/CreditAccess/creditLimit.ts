import prisma from "../../../../../db";

export const creditLimit = async (req, res) => {
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
    return res.status(500).json({ error: `Error retrieving loan: ${error.message}`});
  }
};