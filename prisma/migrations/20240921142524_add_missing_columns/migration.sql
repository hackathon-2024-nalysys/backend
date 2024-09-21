-- AlterTable
ALTER TABLE "account" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "account_hobby" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false;
