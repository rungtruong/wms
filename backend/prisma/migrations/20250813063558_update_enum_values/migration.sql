/*
  Warnings:

  - The values [repair,replacement,inspection,maintenance] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [suspended] on the enum `ContractStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [new,pending] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [employee] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,void] on the enum `WarrantyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ActionType_new" AS ENUM ('created', 'updated', 'status_changed', 'comment_added');
ALTER TABLE "public"."warranty_history" ALTER COLUMN "action_type" TYPE "public"."ActionType_new" USING ("action_type"::text::"public"."ActionType_new");
ALTER TYPE "public"."ActionType" RENAME TO "ActionType_old";
ALTER TYPE "public"."ActionType_new" RENAME TO "ActionType";
DROP TYPE "public"."ActionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ContractStatus_new" AS ENUM ('active', 'expired', 'cancelled', 'pending');
ALTER TABLE "public"."contracts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."contracts" ALTER COLUMN "status" TYPE "public"."ContractStatus_new" USING ("status"::text::"public"."ContractStatus_new");
ALTER TYPE "public"."ContractStatus" RENAME TO "ContractStatus_old";
ALTER TYPE "public"."ContractStatus_new" RENAME TO "ContractStatus";
DROP TYPE "public"."ContractStatus_old";
ALTER TABLE "public"."contracts" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TicketStatus_new" AS ENUM ('open', 'in_progress', 'resolved', 'closed');
ALTER TABLE "public"."tickets" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."tickets" ALTER COLUMN "status" TYPE "public"."TicketStatus_new" USING ("status"::text::"public"."TicketStatus_new");
ALTER TYPE "public"."TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "public"."TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "public"."tickets" ALTER COLUMN "status" SET DEFAULT 'open';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('admin', 'manager', 'technician', 'customer');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'technician';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."WarrantyStatus_new" AS ENUM ('valid', 'expired', 'voided');
ALTER TABLE "public"."serials" ALTER COLUMN "warranty_status" DROP DEFAULT;
ALTER TABLE "public"."serials" ALTER COLUMN "warranty_status" TYPE "public"."WarrantyStatus_new" USING ("warranty_status"::text::"public"."WarrantyStatus_new");
ALTER TYPE "public"."WarrantyStatus" RENAME TO "WarrantyStatus_old";
ALTER TYPE "public"."WarrantyStatus_new" RENAME TO "WarrantyStatus";
DROP TYPE "public"."WarrantyStatus_old";
ALTER TABLE "public"."serials" ALTER COLUMN "warranty_status" SET DEFAULT 'valid';
COMMIT;

-- AlterTable
ALTER TABLE "public"."serials" ALTER COLUMN "warranty_status" SET DEFAULT 'valid';

-- AlterTable
ALTER TABLE "public"."tickets" ALTER COLUMN "status" SET DEFAULT 'open';

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'technician';
