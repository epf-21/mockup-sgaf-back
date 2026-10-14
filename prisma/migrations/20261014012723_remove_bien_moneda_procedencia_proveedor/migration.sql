/*
  Warnings:

  - You are about to drop the column `moneda` on the `bien` table. All the data in the column will be lost.
  - You are about to drop the column `procedencia` on the `bien` table. All the data in the column will be lost.
  - You are about to drop the column `proveedor` on the `bien` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bien" DROP COLUMN "moneda",
DROP COLUMN "procedencia",
DROP COLUMN "proveedor";
