/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accessUrlToken]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Employee_accessToken_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "accessToken",
ADD COLUMN     "accessUrlToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_accessUrlToken_key" ON "Employee"("accessUrlToken");
