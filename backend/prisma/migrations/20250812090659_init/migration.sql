-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'manager', 'employee', 'customer');

-- CreateEnum
CREATE TYPE "public"."ContractStatus" AS ENUM ('active', 'expired', 'suspended', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."WarrantyStatus" AS ENUM ('active', 'expired', 'void');

-- CreateEnum
CREATE TYPE "public"."TicketPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('new', 'in_progress', 'pending', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('repair', 'replacement', 'inspection', 'maintenance');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'employee',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contracts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contract_number" VARCHAR(50) NOT NULL,
    "customer_id" UUID,
    "customer_name" VARCHAR(100) NOT NULL,
    "customer_email" VARCHAR(255),
    "customer_phone" VARCHAR(20),
    "customer_address" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "terms_conditions" TEXT,
    "status" "public"."ContractStatus" NOT NULL DEFAULT 'active',
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50),
    "description" TEXT,
    "warranty_months" INTEGER NOT NULL DEFAULT 12,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contract_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "contract_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."serials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serial_number" VARCHAR(100) NOT NULL,
    "product_id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "manufacture_date" DATE,
    "purchase_date" DATE,
    "warranty_status" "public"."WarrantyStatus" NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "serials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tickets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ticket_number" VARCHAR(50) NOT NULL,
    "serial_id" UUID NOT NULL,
    "customer_name" VARCHAR(100) NOT NULL,
    "customer_email" VARCHAR(255),
    "customer_phone" VARCHAR(20),
    "issue_description" TEXT NOT NULL,
    "priority" "public"."TicketPriority" NOT NULL DEFAULT 'medium',
    "status" "public"."TicketStatus" NOT NULL DEFAULT 'new',
    "assigned_to" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ticket_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ticket_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "comment" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."warranty_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serial_id" UUID NOT NULL,
    "action_type" "public"."ActionType" NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2),
    "performed_by" UUID NOT NULL,
    "performed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warranty_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "public"."users"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contract_number_key" ON "public"."contracts"("contract_number");

-- CreateIndex
CREATE INDEX "contracts_contract_number_idx" ON "public"."contracts"("contract_number");

-- CreateIndex
CREATE INDEX "contracts_customer_email_idx" ON "public"."contracts"("customer_email");

-- CreateIndex
CREATE INDEX "contracts_status_idx" ON "public"."contracts"("status");

-- CreateIndex
CREATE INDEX "contracts_start_date_end_date_idx" ON "public"."contracts"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "public"."products"("name");

-- CreateIndex
CREATE INDEX "products_model_idx" ON "public"."products"("model");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "public"."products"("category");

-- CreateIndex
CREATE UNIQUE INDEX "serials_serial_number_key" ON "public"."serials"("serial_number");

-- CreateIndex
CREATE INDEX "serials_serial_number_idx" ON "public"."serials"("serial_number");

-- CreateIndex
CREATE INDEX "serials_product_id_idx" ON "public"."serials"("product_id");

-- CreateIndex
CREATE INDEX "serials_contract_id_idx" ON "public"."serials"("contract_id");

-- CreateIndex
CREATE INDEX "serials_warranty_status_idx" ON "public"."serials"("warranty_status");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticket_number_key" ON "public"."tickets"("ticket_number");

-- CreateIndex
CREATE INDEX "tickets_ticket_number_idx" ON "public"."tickets"("ticket_number");

-- CreateIndex
CREATE INDEX "tickets_serial_id_idx" ON "public"."tickets"("serial_id");

-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "public"."tickets"("status");

-- CreateIndex
CREATE INDEX "tickets_priority_idx" ON "public"."tickets"("priority");

-- CreateIndex
CREATE INDEX "tickets_assigned_to_idx" ON "public"."tickets"("assigned_to");

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_products" ADD CONSTRAINT "contract_products_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_products" ADD CONSTRAINT "contract_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."serials" ADD CONSTRAINT "serials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."serials" ADD CONSTRAINT "serials_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_serial_id_fkey" FOREIGN KEY ("serial_id") REFERENCES "public"."serials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_comments" ADD CONSTRAINT "ticket_comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_comments" ADD CONSTRAINT "ticket_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."warranty_history" ADD CONSTRAINT "warranty_history_serial_id_fkey" FOREIGN KEY ("serial_id") REFERENCES "public"."serials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."warranty_history" ADD CONSTRAINT "warranty_history_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
