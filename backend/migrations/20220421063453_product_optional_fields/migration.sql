/*
  Warnings:

  - Made the column `name` on table `tbl_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `tbl_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `tbl_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `tbl_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `manufactured_by` on table `tbl_product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tbl_product" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "manufactured_by" SET NOT NULL;
