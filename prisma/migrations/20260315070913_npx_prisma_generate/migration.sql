/*
  Warnings:

  - You are about to drop the column `type` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `otpType` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Otp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "otpType" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Otp" ("createdAt", "email", "expiresAt", "id", "otp") SELECT "createdAt", "email", "expiresAt", "id", "otp" FROM "Otp";
DROP TABLE "Otp";
ALTER TABLE "new_Otp" RENAME TO "Otp";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
