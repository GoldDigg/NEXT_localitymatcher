/*
  Warnings:

  - You are about to drop the `_CompanyDesiredFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompanyFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PropertyFeatures` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orgNumber]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_CompanyDesiredFeatures" DROP CONSTRAINT "_CompanyDesiredFeatures_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyDesiredFeatures" DROP CONSTRAINT "_CompanyDesiredFeatures_B_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyFeatures" DROP CONSTRAINT "_CompanyFeatures_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyFeatures" DROP CONSTRAINT "_CompanyFeatures_B_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyFeatures" DROP CONSTRAINT "_PropertyFeatures_A_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyFeatures" DROP CONSTRAINT "_PropertyFeatures_B_fkey";

-- DropTable
DROP TABLE "_CompanyDesiredFeatures";

-- DropTable
DROP TABLE "_CompanyFeatures";

-- DropTable
DROP TABLE "_PropertyFeatures";

-- CreateTable
CREATE TABLE "_CompanyEgenskaper" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CompanyDesiredEgenskaper" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PropertyEgenskaper" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyEgenskaper_AB_unique" ON "_CompanyEgenskaper"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyEgenskaper_B_index" ON "_CompanyEgenskaper"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyDesiredEgenskaper_AB_unique" ON "_CompanyDesiredEgenskaper"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyDesiredEgenskaper_B_index" ON "_CompanyDesiredEgenskaper"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PropertyEgenskaper_AB_unique" ON "_PropertyEgenskaper"("A", "B");

-- CreateIndex
CREATE INDEX "_PropertyEgenskaper_B_index" ON "_PropertyEgenskaper"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Company_orgNumber_key" ON "Company"("orgNumber");

-- AddForeignKey
ALTER TABLE "_CompanyEgenskaper" ADD CONSTRAINT "_CompanyEgenskaper_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyEgenskaper" ADD CONSTRAINT "_CompanyEgenskaper_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDesiredEgenskaper" ADD CONSTRAINT "_CompanyDesiredEgenskaper_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDesiredEgenskaper" ADD CONSTRAINT "_CompanyDesiredEgenskaper_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyEgenskaper" ADD CONSTRAINT "_PropertyEgenskaper_A_fkey" FOREIGN KEY ("A") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyEgenskaper" ADD CONSTRAINT "_PropertyEgenskaper_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
