/*
  Warnings:

  - You are about to drop the column `roles` on the `Contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "roles",
ADD COLUMN     "role" INTEGER DEFAULT 1;
