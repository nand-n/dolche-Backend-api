import prisma from "../db";
// Calculate credit score based on transaction history and debt
export const creditHistory = async (req, res) => {
    try {
    const { userId, debt, spendingHabits } = req.body;

    // Retrieve user's transaction history
    const transactions = await prisma.transaction.findMany({
        where: {
            userId: userId
        }
    });
        res.json({transactions:transactions})

    // // Calculate average monthly spending
    // const totalSpending = transactions.reduce((total, { transactionAmt }) => total + transactionAmt, 0);
    // const monthsSinceFirstTransaction = (Date.now() - transactions[0].transactionDate) / 1000 / 60 / 60 / 24 / 30;
    // const avgMonthlySpending = totalSpending / monthsSinceFirstTransaction;

    // // Calculate credit utilization
    // const totalCreditLimit = 10000; // Assume a total credit limit of $10,000 for the user
    // const creditUtilization = totalSpending / totalCreditLimit;

    // // Calculate credit score based on debt and credit utilization
    // const creditScore = 700 - (debt * 50) - (creditUtilization * 100);

    // // Predict next month's spending based on past spending habits
    // const predictedSpending = avgMonthlySpending * spendingHabits;

    // // Respond with credit score and predicted spending
    // res.json({ creditScore, predictedSpending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


/*****FikoScore DB Shema*******/
// model CreditAccount {
//   id            Int      @id @default(autoincrement())
//   userId        Int
//   accountType   String
//   accountNumber String
//   balance       Float
//   limit         Float
//   paymentHistory PaymentHistory[]
// }

// model PaymentHistory {
//   id              Int      @id @default(autoincrement())
//   creditAccountId Int
//   date            DateTime
//   amount          Float
// }

//FIKO Score Calculator
export const FicoScore = async (req, res) => {
    try {
        const accounts = await prisma.creditAccount.findMany();
        res.json({accounts:accounts})
        // const ficoScores = accounts.map(account => {
        //     const paymentHistoryScore =
        //         account.paymentHistory === 'paid_on_time'
        //             ? 1
        //             : account.paymentHistory === 'late_payment'
        //                 ? 0.75
        //                 : 0.5;

        //     const utilizationRatio =
        //         account.creditUsed / account.creditLimit;

        //     const lengthOfCreditHistory =
        //         (Date.now() - account.openedAt) / (1000 * 60 * 60 * 24 * 365);

        //     const creditMixScore =
        //         account.accountType === 'credit_card'
        //             ? 1
        //             : account.accountType === 'loan'
        //                 ? 0.75
        //                 : 0.5;

        //     const ficoScore =
        //         paymentHistoryScore * 0.35 +
        //         utilizationRatio * 0.3 +
        //         lengthOfCreditHistory * 0.15 +
        //         creditMixScore * 0.1;

        //     return { accountId: account.id, ficoScore };
        // });

        // res.json(ficoScores);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
    
}