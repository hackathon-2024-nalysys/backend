/*
  Warnings:

  - Added the required column `displayName` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "displayName" TEXT NOT NULL;
