/*
  Warnings:

  - You are about to alter the column `executedValue` on the `Contract` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Integer`.
  - Made the column `executedValue` on table `Contract` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "executedValue" SET NOT NULL,
ALTER COLUMN "executedValue" SET DATA TYPE INTEGER;
