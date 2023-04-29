/*
  Warnings:

  - The `amount` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "recipientId" TEXT,
ADD COLUMN     "senderId" TEXT,
DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" DOUBLE PRECISION DEFAULT 0;
