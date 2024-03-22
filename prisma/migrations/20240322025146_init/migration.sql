-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prices" JSONB NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "tags" JSONB[],
    "category" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
