/*
  Warnings:

  - You are about to alter the column `contractValue` on the `Contract` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `refundAmount` on the `Contract` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `executedValue` on the `Contract` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "contractValue" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "refundAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "executedValue" SET DATA TYPE DECIMAL(10,2);
