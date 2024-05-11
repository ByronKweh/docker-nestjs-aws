-- DropForeignKey
ALTER TABLE "job_listing" DROP CONSTRAINT "job_listing_created_by_id_fkey";

-- AddForeignKey
ALTER TABLE "job_listing" ADD CONSTRAINT "job_listing_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "recruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
