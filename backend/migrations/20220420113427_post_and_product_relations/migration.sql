-- AddForeignKey
ALTER TABLE "tbl_post" ADD CONSTRAINT "tbl_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_product" ADD CONSTRAINT "tbl_product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
