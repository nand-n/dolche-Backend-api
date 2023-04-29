// import prisma from "../../db";
// import XLSX  from 'xlsx'

// // Endpoint for creating a new transaction
// export  const Transactions = async (req, res) => {
//   try {
//     // Extract transaction data from the request body
//     const { from_account, to_account, amount, description ,userId} = req.body;

//     // Debit from the "from_account"
//     const debit = await prisma.transaction.create({
//       data: {
//         account: from_account,
//         transaction_type: "debit",
//         amount:amount,
//         description: description,
//         userId:userId,
//       },
//     });
//     if (!debit) {
//       return res.status(401).json(`Error for the debit code`)
//     }

//     // Credit to the "to_account"
//     const credit = await prisma.transaction.create({
//       data: {
//         account: to_account,
//         transaction_type: "credit",
//        amount:amount,
//         description: description,
//         userId:userId,
//       },
//     });
//      if (!credit) {
//       return res.status(401).json(`Error for the credit code`)
//     }

//   //   // Update the balance of the "from_account"
//   //  const updateFromAccount=  await prisma.account.update({
//   //     where: {
//   //       id: from_account,
//   //     },
//   //     data: {
//   //       // balance: {
//   //       //   decrement: amount,
//   //       // },
//   //          balance: amount,
//   //     },
//   //   });
//   //    if (!updateFromAccount) {
//   //     return res.status(401).json(`Error for the updateFromAccount code`)
//   //   }

//   // //   // Update the balance of the "to_account"
//   // const updateToAccount=  await prisma.account.update({
//   //     where: {
//   //       id: to_account,
//   //     },
//   //     // data: {
//   //     //   balance: {
//   //     //     increment: amount,
//   //     //   },
//   //     data: {
//   //       balance: amount,
      
//   //     },
//   // });
//   //    if (!updateToAccount) {
//   //     return res.status(401).json(`Error for the updateToAccount code`)
//   //   }

//   return  res.status(201).json({ debit, credit });

//   } catch (error) {
//     console.error(error);
//    return res.status(500).send('Internal Server Error');
//   }
//   // res.status(200).json({status:"wtf"})
// };

// // Endpoint for generating payment history in xlsx format
// export const PaymentHistory = async (req, res) => {
//   // const {userId ,paymentId } = req.body
//   try {
//     // Fetch payment data from your database using Prisma
//     const payments = await prisma.payment.findMany({});

//     // Create a new workbook and worksheet using xlsx
//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(payments);

//     // Add the worksheet to the workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment History');

//     // Generate a unique filename for the xlsx file
//     const filename = `payment-history-${Date.now()}.xlsx`;

//     // Set headers to force download of the file
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

//     // Send the xlsx file to the client
//     XLSX.writeFile(workbook, res);
//     res.status(200).json({message:`Workbook Created sucessfully! with Payment History : ${payments}`})

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ErrorMessage:`Error with internal server or ${error.message}`})
//   }
// };
