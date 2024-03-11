/*
  Warnings:

  - You are about to alter the column `contractValue` on the `Contract` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Integer`.
  - You are about to alter the column `refundAmount` on the `Contract` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "contractValue" SET DATA TYPE INTEGER,
ALTER COLUMN "refundAmount" SET DATA TYPE INTEGER;
