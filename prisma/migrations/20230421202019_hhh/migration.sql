/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Agents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Agents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Agents" ADD COLUMN     "balance" DOUBLE PRECISION,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "username" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "balance" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agents_id_key" ON "Agents"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Agents_phone_key" ON "Agents"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");
