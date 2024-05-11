-- CreateTable
CREATE TABLE "recruiter" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "recruiter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recruiter_user_id_key" ON "recruiter"("user_id");

-- AddForeignKey
ALTER TABLE "recruiter" ADD CONSTRAINT "recruiter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
