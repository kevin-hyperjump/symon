/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[apiKey]` on the table `apiKey`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "apiKey.apiKey_unique" ON "apiKey"("apiKey");
