-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "contractValue" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "refundAmount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "executedValue" SET DATA TYPE DECIMAL(65,30);
