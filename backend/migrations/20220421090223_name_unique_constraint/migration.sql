/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tbl_product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tbl_product_name_key" ON "tbl_product"("name");
