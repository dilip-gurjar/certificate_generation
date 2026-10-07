/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "accessToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_accessToken_key" ON "Employee"("accessToken");
