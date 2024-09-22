/*
  Warnings:

  - You are about to drop the column `area` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `contractEndDate` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `desiredSizeMax` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `orgNumber` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `rent` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `streetAddress` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `availableFrom` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `propertyOwner` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `rent` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Property` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Company_orgNumber_key";

-- DropIndex
DROP INDEX "Tag_name_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "area",
DROP COLUMN "contractEndDate",
DROP COLUMN "desiredSizeMax",
DROP COLUMN "name",
DROP COLUMN "orgNumber",
DROP COLUMN "rent",
DROP COLUMN "size",
DROP COLUMN "streetAddress";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "address",
DROP COLUMN "area",
DROP COLUMN "availableFrom",
DROP COLUMN "createdAt",
DROP COLUMN "propertyOwner",
DROP COLUMN "rent",
DROP COLUMN "size",
DROP COLUMN "updatedAt";
