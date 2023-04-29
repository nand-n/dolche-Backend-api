/*
  Warnings:

  - The `balance` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PaymentHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "balance",
ADD COLUMN     "balance" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PaymentHistory" DROP CONSTRAINT "PaymentHistory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PaymentHistory_id_seq";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "recieverId" TEXT;

-- CreateTable
CREATE TABLE "Equb" (
    "id" TEXT NOT NULL,
    "cretedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" TEXT,
    "activate" BOOLEAN NOT NULL DEFAULT false,
    "equbName" TEXT,
    "equbType" TEXT,
    "equbMemberLimit" TEXT,
    "equbMonthlyPayment" TEXT,
    "equbCretorName" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Equb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedEqub" (
    "id" TEXT NOT NULL,
    "cretedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "income" TEXT,
    "emplymnetStatus" TEXT,
    "debt" TEXT,
    "legalAgreement" TEXT,
    "equbPurpose" TEXT,
    "userId" TEXT NOT NULL,
    "equbID" TEXT NOT NULL,

    CONSTRAINT "SelectedEqub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "cretedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "password" TEXT,
    "branchaproval" BOOLEAN NOT NULL DEFAULT false,
    "transactionId" TEXT,
    "amout" TEXT,
    "userId" TEXT,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "cretedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "adminAprival" BOOLEAN NOT NULL DEFAULT false,
    "transactionId" TEXT NOT NULL,
    "amout" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "cretedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION,
    "facilitationFee" DOUBLE PRECISION,
    "penaltyFee" DOUBLE PRECISION,
    "facilitationAmount" DOUBLE PRECISION,
    "penaltyAmount" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Equb" ADD CONSTRAINT "Equb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedEqub" ADD CONSTRAINT "SelectedEqub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedEqub" ADD CONSTRAINT "SelectedEqub_equbID_fkey" FOREIGN KEY ("equbID") REFERENCES "Equb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
