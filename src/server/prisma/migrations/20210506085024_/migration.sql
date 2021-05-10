/*
  Warnings:

  - Added the required column `name` to the `apiKey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_apiKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    FOREIGN KEY ("projectID") REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_apiKey" ("id", "projectID", "apiKey", "isEnabled", "createdAt", "updatedAt", "createdBy", "updatedBy") SELECT "id", "projectID", "apiKey", "isEnabled", "createdAt", "updatedAt", "createdBy", "updatedBy" FROM "apiKey";
DROP TABLE "apiKey";
ALTER TABLE "new_apiKey" RENAME TO "apiKey";
CREATE UNIQUE INDEX "apiKey.apiKey_unique" ON "apiKey"("apiKey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
