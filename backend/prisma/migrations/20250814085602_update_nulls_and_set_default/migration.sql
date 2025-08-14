-- Update existing NULL values to 'new'
UPDATE "public"."tickets" SET "status" = 'new' WHERE "status" IS NULL;

-- AlterTable
ALTER TABLE "public"."tickets" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'new';