/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "shareToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_shareToken_key" ON "Employee"("shareToken");
