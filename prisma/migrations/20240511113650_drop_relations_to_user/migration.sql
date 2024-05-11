/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `job_listing` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "job_listing" DROP CONSTRAINT "job_listing_created_by_id_fkey";

-- AlterTable
ALTER TABLE "job_listing" DROP COLUMN "created_by_id";
