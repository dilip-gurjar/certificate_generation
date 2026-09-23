/*
  Warnings:

  - You are about to drop the column `experience` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `field` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `joiningDate` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `leavingDate` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workEmail]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personalEmail]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[did]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `certificateData` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workEmail` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_employeeId_fkey";

-- DropIndex
DROP INDEX "Employee_email_key";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "experience",
DROP COLUMN "field",
DROP COLUMN "joiningDate",
DROP COLUMN "leavingDate",
ADD COLUMN     "certificateData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "email",
ADD COLUMN     "did" TEXT,
ADD COLUMN     "leavingDate" TIMESTAMP(3),
ADD COLUMN     "personalEmail" TEXT,
ADD COLUMN     "workEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_employeeId_key" ON "Certificate"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_workEmail_key" ON "Employee"("workEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_personalEmail_key" ON "Employee"("personalEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_did_key" ON "Employee"("did");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
