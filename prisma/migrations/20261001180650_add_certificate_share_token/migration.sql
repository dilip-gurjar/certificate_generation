/*
  Warnings:

  - You are about to drop the column `shareToken` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shareToken]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Employee_shareToken_key";

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "shareToken" TEXT;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "shareToken";

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_shareToken_key" ON "Certificate"("shareToken");
