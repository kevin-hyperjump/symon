/*
  Warnings:

  - You are about to drop the column `config` on the `monika` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `monika` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `monika` table. All the data in the column will be lost.
  - Added the required column `hostname` to the `monika` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "monika.version_unique";

-- CreateTable
CREATE TABLE "monikaProbe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monika_id" INTEGER,
    "probe_id" INTEGER,
    FOREIGN KEY ("monika_id") REFERENCES "monika" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("probe_id") REFERENCES "probe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "monikaNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monika_id" INTEGER,
    "notification_id" INTEGER,
    FOREIGN KEY ("monika_id") REFERENCES "monika" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("notification_id") REFERENCES "notification" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_monika" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostname" TEXT NOT NULL,
    "instance_id" TEXT NOT NULL
);
INSERT INTO "new_monika" ("id", "instance_id") SELECT "id", "instance_id" FROM "monika";
DROP TABLE "monika";
ALTER TABLE "new_monika" RENAME TO "monika";
CREATE UNIQUE INDEX "monika.hostname_unique" ON "monika"("hostname");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
