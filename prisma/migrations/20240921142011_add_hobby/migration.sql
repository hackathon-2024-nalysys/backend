-- CreateTable
CREATE TABLE "hobby" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vector" DOUBLE PRECISION[],

    CONSTRAINT "hobby_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "account_hobby" (
    "account_id" UUID NOT NULL,
    "hobby_name" TEXT NOT NULL,

    CONSTRAINT "account_hobby_pkey" PRIMARY KEY ("account_id","hobby_name")
);

-- CreateIndex
CREATE INDEX "account_hobby_hobby_name_idx" ON "account_hobby"("hobby_name");

-- AddForeignKey
ALTER TABLE "account_hobby" ADD CONSTRAINT "account_hobby_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_hobby" ADD CONSTRAINT "account_hobby_hobby_name_fkey" FOREIGN KEY ("hobby_name") REFERENCES "hobby"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
