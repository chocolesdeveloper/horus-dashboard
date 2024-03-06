/*
  Warnings:

  - You are about to drop the column `role` on the `Contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" INTEGER NOT NULL DEFAULT 1;
