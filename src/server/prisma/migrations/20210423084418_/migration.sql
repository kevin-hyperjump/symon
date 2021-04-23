/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[version]` on the table `monika`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "monika.version_unique" ON "monika"("version");
