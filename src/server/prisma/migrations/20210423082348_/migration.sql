-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "enabled" INTEGER NOT NULL,
    "suspended" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "location" (
    "entityId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locationName" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "dataCenter" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "probe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "probeName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "runMode" TEXT NOT NULL,
    "cron" TEXT NOT NULL,
    FOREIGN KEY ("projectID") REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "config" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "monika" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "config" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "monika_id" TEXT NOT NULL,
    "monika_ip_address" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user.email_unique" ON "user"("email");
