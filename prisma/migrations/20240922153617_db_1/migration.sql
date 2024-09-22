/*
  Warnings:

  - You are about to drop the `_CompanyDesiredAreas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgNumber` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetAddress` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableFrom` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyOwner` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vacant` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CompanyDesiredAreas" DROP CONSTRAINT "_CompanyDesiredAreas_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyDesiredAreas" DROP CONSTRAINT "_CompanyDesiredAreas_B_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "contractEndDate" TIMESTAMP(3),
ADD COLUMN     "currentAreaId" INTEGER,
ADD COLUMN     "desiredSizeMax" DOUBLE PRECISION,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "orgNumber" TEXT NOT NULL,
ADD COLUMN     "rent" DOUBLE PRECISION,
ADD COLUMN     "size" DOUBLE PRECISION,
ADD COLUMN     "streetAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "availableFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "propertyOwner" TEXT NOT NULL,
ADD COLUMN     "rent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "size" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vacant" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "_CompanyDesiredAreas";

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DesiredCompanyAreas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DesiredCompanyAreas_AB_unique" ON "_DesiredCompanyAreas"("A", "B");

-- CreateIndex
CREATE INDEX "_DesiredCompanyAreas_B_index" ON "_DesiredCompanyAreas"("B");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_currentAreaId_fkey" FOREIGN KEY ("currentAreaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DesiredCompanyAreas" ADD CONSTRAINT "_DesiredCompanyAreas_A_fkey" FOREIGN KEY ("A") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DesiredCompanyAreas" ADD CONSTRAINT "_DesiredCompanyAreas_B_fkey" FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
