-- Migration to merge products and serials tables into product_serials

-- Create the new product_serials table
CREATE TABLE "product_serials" (
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
    "warranty_status" "WarrantyStatus" NOT NULL DEFAULT 'valid',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_serials_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on serial_number
CREATE UNIQUE INDEX "product_serials_serial_number_key" ON "product_serials"("serial_number");

-- Create indexes
CREATE INDEX "product_serials_serial_number_idx" ON "product_serials"("serial_number");
CREATE INDEX "product_serials_name_idx" ON "product_serials"("name");
CREATE INDEX "product_serials_model_idx" ON "product_serials"("model");
CREATE INDEX "product_serials_category_idx" ON "product_serials"("category");
CREATE INDEX "product_serials_contract_id_idx" ON "product_serials"("contract_id");
CREATE INDEX "product_serials_warranty_status_idx" ON "product_serials"("warranty_status");

-- Add foreign key constraint
ALTER TABLE "product_serials" ADD CONSTRAINT "product_serials_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate data from serials and products tables
INSERT INTO "product_serials" (
    "id",
    "serial_number",
    "name",
    "model",
    "category",
    "description",
    "warranty_months",
    "contract_id",
    "manufacture_date",
    "purchase_date",
    "warranty_status",
    "is_active",
    "notes",
    "created_at",
    "updated_at"
)
SELECT 
    s."id",
    s."serial_number",
    p."name",
    p."model",
    p."category",
    p."description",
    p."warranty_months",
    s."contract_id",
    s."manufacture_date",
    s."purchase_date",
    s."warranty_status",
    p."is_active",
    s."notes",
    s."created_at",
    s."updated_at"
FROM "serials" s
JOIN "products" p ON s."product_id" = p."id";

-- Update contract_products table to reference product_serials
ALTER TABLE "contract_products" ADD COLUMN "product_serial_id" UUID;

-- Migrate contract_products data
UPDATE "contract_products" cp
SET "product_serial_id" = s."id"
FROM "serials" s
WHERE s."product_id" = cp."product_id";

-- Update tickets table
ALTER TABLE "tickets" ADD COLUMN "product_serial_id" UUID;

UPDATE "tickets" t
SET "product_serial_id" = t."serial_id";

ALTER TABLE "tickets" ALTER COLUMN "product_serial_id" SET NOT NULL;

-- Add foreign key constraint for tickets
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_product_serial_id_fkey" FOREIGN KEY ("product_serial_id") REFERENCES "product_serials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update warranty_history table
ALTER TABLE "warranty_history" ADD COLUMN "product_serial_id" UUID;

UPDATE "warranty_history" wh
SET "product_serial_id" = wh."serial_id";

ALTER TABLE "warranty_history" ALTER COLUMN "product_serial_id" SET NOT NULL;

-- Add foreign key constraint for warranty_history
ALTER TABLE "warranty_history" ADD CONSTRAINT "warranty_history_product_serial_id_fkey" FOREIGN KEY ("product_serial_id") REFERENCES "product_serials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop old foreign key constraints and columns
ALTER TABLE "contract_products" DROP CONSTRAINT "contract_products_product_id_fkey";
ALTER TABLE "contract_products" DROP COLUMN "product_id";
ALTER TABLE "contract_products" ALTER COLUMN "product_serial_id" SET NOT NULL;
ALTER TABLE "contract_products" ADD CONSTRAINT "contract_products_product_serial_id_fkey" FOREIGN KEY ("product_serial_id") REFERENCES "product_serials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tickets" DROP CONSTRAINT "tickets_serial_id_fkey";
ALTER TABLE "tickets" DROP COLUMN "serial_id";

ALTER TABLE "warranty_history" DROP CONSTRAINT "warranty_history_serial_id_fkey";
ALTER TABLE "warranty_history" DROP COLUMN "serial_id";

-- Drop old tables
DROP TABLE "serials";
DROP TABLE "products";

-- Update indexes for modified tables
DROP INDEX IF EXISTS "tickets_serial_id_idx";
CREATE INDEX "tickets_product_serial_id_idx" ON "tickets"("product_serial_id");