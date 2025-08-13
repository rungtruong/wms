/*
  Warnings:

  - You are about to drop the column `product_id` on the `contract_products` table. All the data in the column will be lost.
  - You are about to drop the column `serial_id` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `serial_id` on the `warranty_history` table. All the data in the column will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serials` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_serial_id` to the `contract_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_serial_id` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_serial_id` to the `warranty_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."contract_products" DROP CONSTRAINT "contract_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."serials" DROP CONSTRAINT "serials_contract_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."serials" DROP CONSTRAINT "serials_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tickets" DROP CONSTRAINT "tickets_serial_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."warranty_history" DROP CONSTRAINT "warranty_history_serial_id_fkey";

-- DropIndex
DROP INDEX "public"."tickets_serial_id_idx";

-- AlterTable
ALTER TABLE "public"."contract_products" DROP COLUMN "product_id",
ADD COLUMN     "product_serial_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."tickets" DROP COLUMN "serial_id",
ADD COLUMN     "product_serial_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."warranty_history" DROP COLUMN "serial_id",
ADD COLUMN     "product_serial_id" UUID NOT NULL;

-- DropTable
DROP TABLE "public"."products";

-- DropTable
DROP TABLE "public"."serials";

-- CreateTable
CREATE TABLE "public"."product_serials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serial_number" VARCHAR(100) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50),
    "description" TEXT,
    "warranty_months" INTEGER NOT NULL DEFAULT 12,
    "contract_id" UUID,
    "manufacture_date" DATE,
    "purchase_date" DATE,
    "warranty_status" "public"."WarrantyStatus" NOT NULL DEFAULT 'valid',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_serials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_serials_serial_number_key" ON "public"."product_serials"("serial_number");

-- CreateIndex
CREATE INDEX "product_serials_serial_number_idx" ON "public"."product_serials"("serial_number");

-- CreateIndex
CREATE INDEX "product_serials_name_idx" ON "public"."product_serials"("name");

-- CreateIndex
CREATE INDEX "product_serials_model_idx" ON "public"."product_serials"("model");

-- CreateIndex
CREATE INDEX "product_serials_category_idx" ON "public"."product_serials"("category");

-- CreateIndex
CREATE INDEX "product_serials_contract_id_idx" ON "public"."product_serials"("contract_id");

-- CreateIndex
CREATE INDEX "product_serials_warranty_status_idx" ON "public"."product_serials"("warranty_status");

-- CreateIndex
CREATE INDEX "tickets_product_serial_id_idx" ON "public"."tickets"("product_serial_id");

-- AddForeignKey
ALTER TABLE "public"."product_serials" ADD CONSTRAINT "product_serials_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_products" ADD CONSTRAINT "contract_products_product_serial_id_fkey" FOREIGN KEY ("product_serial_id") REFERENCES "public"."product_serials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_product_serial_id_fkey" FOREIGN KEY ("product_serial_id") REFERENCES "public"."product_serials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."warranty_history" ADD CONSTRAINT "warranty_history_product_serial_id_fkey" FOREIGN KEY ("product_serial_id") REFERENCES "public"."product_serials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
