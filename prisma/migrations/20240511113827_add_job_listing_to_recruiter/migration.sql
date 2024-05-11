/*
  Warnings:

  - Added the required column `created_by_id` to the `job_listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_listing" ADD COLUMN     "created_by_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "job_listing" ADD CONSTRAINT "job_listing_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "recruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
