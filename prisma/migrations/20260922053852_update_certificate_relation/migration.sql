/*
  Warnings:

  - You are about to drop the column `certificateNumber` on the `Certificate` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Certificate_certificateNumber_key";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "certificateNumber";
