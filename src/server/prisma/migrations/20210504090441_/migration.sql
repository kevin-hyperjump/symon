/*
  Warnings:

  - You are about to drop the column `projectID` on the `probe` table. All the data in the column will be lost.
  - You are about to drop the column `probeName` on the `probe` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `probe` table. All the data in the column will be lost.
  - You are about to drop the column `runMode` on the `probe` table. All the data in the column will be lost.
  - You are about to drop the column `cron` on the `probe` table. All the data in the column will be lost.
  - Added the required column `name` to the `probe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `probe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `probe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "probeRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "method" TEXT,
    "timeout" INTEGER,
    "headers" TEXT,
    "body" TEXT,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "probeId" INTEGER,
    FOREIGN KEY ("probeId") REFERENCES "probe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_probe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "alerts" TEXT,
    "interval" INTEGER,
    "incidentThreshold" INTEGER,
    "recoveryThreshold" INTEGER,
    "enabled" BOOLEAN,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL
);
INSERT INTO "new_probe" ("id") SELECT "id" FROM "probe";
DROP TABLE "probe";
ALTER TABLE "new_probe" RENAME TO "probe";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
