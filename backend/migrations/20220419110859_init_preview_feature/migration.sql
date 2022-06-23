-- AlterTable
ALTER TABLE "tbl_user" ADD COLUMN     "password" TEXT,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL;
