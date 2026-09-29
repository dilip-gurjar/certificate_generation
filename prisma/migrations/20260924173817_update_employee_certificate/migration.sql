/*
  Warnings:

  - You are about to drop the column `certificateData` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "certificateData",
ADD COLUMN     "privateKey" TEXT,
ADD COLUMN     "publicKey" TEXT;
