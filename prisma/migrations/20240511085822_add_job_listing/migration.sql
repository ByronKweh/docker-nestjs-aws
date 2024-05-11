-- DropForeignKey
ALTER TABLE "recruiter" DROP CONSTRAINT "recruiter_user_id_fkey";

-- CreateTable
CREATE TABLE "job_listing" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_posted" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "job_listing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recruiter" ADD CONSTRAINT "recruiter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
