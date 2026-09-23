-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
