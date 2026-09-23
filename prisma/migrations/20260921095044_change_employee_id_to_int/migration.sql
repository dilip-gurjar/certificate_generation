/*
  Warnings:

  - The primary key for the `Certificate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Certificate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `employeeId` on the `Certificate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_employeeId_fkey";

-- AlterTable
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "employeeId",
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_employeeId_key" ON "Certificate"("employeeId");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
