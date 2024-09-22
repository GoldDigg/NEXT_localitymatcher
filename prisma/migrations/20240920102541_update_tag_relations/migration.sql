-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "orgNumber" TEXT NOT NULL,
    "streetAddress" TEXT,
    "area" TEXT,
    "size" DOUBLE PRECISION,
    "rent" DOUBLE PRECISION,
    "contractEndDate" TIMESTAMP(3),
    "desiredSizeMin" DOUBLE PRECISION,
    "desiredSizeMax" DOUBLE PRECISION,
    "desiredMaxRent" DOUBLE PRECISION,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "area" TEXT NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL,
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "propertyOwner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyFeatures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CompanyDesiredAreas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CompanyDesiredFeatures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PropertyFeatures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_orgNumber_key" ON "Company"("orgNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyFeatures_AB_unique" ON "_CompanyFeatures"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyFeatures_B_index" ON "_CompanyFeatures"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyDesiredAreas_AB_unique" ON "_CompanyDesiredAreas"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyDesiredAreas_B_index" ON "_CompanyDesiredAreas"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyDesiredFeatures_AB_unique" ON "_CompanyDesiredFeatures"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyDesiredFeatures_B_index" ON "_CompanyDesiredFeatures"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PropertyFeatures_AB_unique" ON "_PropertyFeatures"("A", "B");

-- CreateIndex
CREATE INDEX "_PropertyFeatures_B_index" ON "_PropertyFeatures"("B");

-- AddForeignKey
ALTER TABLE "_CompanyFeatures" ADD CONSTRAINT "_CompanyFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyFeatures" ADD CONSTRAINT "_CompanyFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDesiredAreas" ADD CONSTRAINT "_CompanyDesiredAreas_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDesiredAreas" ADD CONSTRAINT "_CompanyDesiredAreas_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDesiredFeatures" ADD CONSTRAINT "_CompanyDesiredFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyDesiredFeatures" ADD CONSTRAINT "_CompanyDesiredFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyFeatures" ADD CONSTRAINT "_PropertyFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyFeatures" ADD CONSTRAINT "_PropertyFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
