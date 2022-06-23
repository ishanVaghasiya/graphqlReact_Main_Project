-- CreateTable
CREATE TABLE "tbl_post" (
    "post_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_by" INTEGER,

    CONSTRAINT "tbl_post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "tbl_product" (
    "product_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER,
    "weight" INTEGER,
    "image" TEXT,
    "manufactured_by" TEXT,
    "status" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_by" INTEGER,

    CONSTRAINT "tbl_product_pkey" PRIMARY KEY ("product_id")
);
