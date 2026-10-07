/*
  Warnings:

  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_employeeId_fkey";

-- DropTable
DROP TABLE "Certificate";

-- DropTable
DROP TABLE "Employee";

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "work_email" TEXT NOT NULL,
    "personal_email" TEXT,
    "password_hash" TEXT,
    "password_salt" TEXT,
    "access_url_token" TEXT,
    "joining_date" TIMESTAMP(3) NOT NULL,
    "leaving_date" TIMESTAMP(3),
    "did" TEXT,
    "public_key" TEXT,
    "encrypted_private_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER,
    "verifiable_credentials" JSONB NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "share_token" TEXT,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_work_email_key" ON "employee"("work_email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_personal_email_key" ON "employee"("personal_email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_access_url_token_key" ON "employee"("access_url_token");

-- CreateIndex
CREATE UNIQUE INDEX "employee_did_key" ON "employee"("did");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_employee_id_key" ON "certificate"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_share_token_key" ON "certificate"("share_token");

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
