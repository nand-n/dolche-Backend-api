// import prisma from "../../../db";

// // Example amounts owed
// const amountsOwed = [
//     { type: 'credit card', balance: 500, limit: 1000 },
//     { type: 'installment loan', balance: 2500, limit: 5000 },
//     { type: 'mortgage', balance: 150000, limit: 200000 },
//   ];

//   // Calculates the amounts owed subscore given an account ID
// async function calculateAmountsOwedSubscore(accountId: number): Promise<number> {
//     // Fetch credit accounts for the given account ID from the database
//     const accounts = await prisma.creditAccount.findMany({
//       where: { accountId },
//       select: { type: true, balance: true, limit: true },
//     });
  
//     // Calculate the credit utilization ratio for each account
//     const utilizationRatios = accounts.map((account) => account.balance / account.limit);
  
//     // Calculate the overall credit utilization ratio
//     const overallUtilizationRatio = utilizationRatios.reduce((sum, ratio) => sum + ratio, 0) / utilizationRatios.length;
  
//     // Determine the subscore based on the overall credit utilization ratio
//     if (overallUtilizationRatio <= 0.10) {
//       return 100;
//     } else if (overallUtilizationRatio <= 0.20) {
//       return 80;
//     } else if (overallUtilizationRatio <= 0.30) {
//       return 60;
//     } else if (overallUtilizationRatio <= 0.40) {
//       return 40;
//     } else {
//       return 20;
//     }
//   }

// //   or

// // Calculates the amounts owed subscore given a list of credit accounts
// // Each account should have a "balance" and "limit" property
// function calculateAmountsOwedSubscore1(accounts: { type: string; balance: number; limit: number }[]): number {
//     try {
//       // Check if the input is valid
//       if (!Array.isArray(accounts) || accounts.length === 0) {
//         throw new Error('Invalid input: expected a non-empty array of credit accounts');
//       }
  
//       // Calculate the credit utilization ratio for each account
//       const utilizationRatios = accounts.map((account) => account.balance / account.limit);
  
//       // Calculate the overall credit utilization ratio
//       const overallUtilizationRatio = utilizationRatios.reduce((sum, ratio) => sum + ratio, 0) / utilizationRatios.length;
  
//       // Determine the subscore based on the overall credit utilization ratio
//       if (overallUtilizationRatio <= 0.10) {
//         return 100;
//       } else if (overallUtilizationRatio <= 0.20) {
//         return 80;
//       } else if (overallUtilizationRatio <= 0.30) {
//         return 60;
//       } else if (overallUtilizationRatio <= 0.40) {
//         return 40;
//       } else {
//         return 20;
//       }
//     } catch (error) {
//       console.error(`Failed to calculate amounts owed subscore: ${error.message}`);
//       return 0;
//     }
//   }