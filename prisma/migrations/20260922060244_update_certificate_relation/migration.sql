/*
  Warnings:

  - You are about to drop the column `certificateData` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `verifiableCredentials` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "certificateData",
ADD COLUMN     "verifiableCredentials" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "updatedAt";
