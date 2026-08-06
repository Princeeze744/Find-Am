-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "linkedProId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "resolution" TEXT NOT NULL DEFAULT '';
