-- CreateTable
CREATE TABLE "public"."ticket_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ticket_id" UUID NOT NULL,
    "action_type" "public"."ActionType" NOT NULL,
    "description" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "performed_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_history_ticket_id_idx" ON "public"."ticket_history"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_history_action_type_idx" ON "public"."ticket_history"("action_type");

-- CreateIndex
CREATE INDEX "ticket_history_created_at_idx" ON "public"."ticket_history"("created_at");

-- AddForeignKey
ALTER TABLE "public"."ticket_history" ADD CONSTRAINT "ticket_history_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_history" ADD CONSTRAINT "ticket_history_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ActionType_new" AS ENUM ('created', 'updated', 'status_changed', 'assigned', 'priority_changed', 'resolved', 'closed', 'reopened');
ALTER TABLE "public"."ticket_history" ALTER COLUMN "action_type" TYPE "public"."ActionType_new" USING ("action_type"::text::"public"."ActionType_new");
ALTER TABLE "public"."warranty_history" ALTER COLUMN "action_type" TYPE "public"."ActionType_new" USING ("action_type"::text::"public"."ActionType_new");
ALTER TYPE "public"."ActionType" RENAME TO "ActionType_old";
ALTER TYPE "public"."ActionType_new" RENAME TO "ActionType";
DROP TYPE "public"."ActionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."ticket_comments" DROP CONSTRAINT "ticket_comments_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ticket_comments" DROP CONSTRAINT "ticket_comments_user_id_fkey";

-- DropTable
DROP TABLE "public"."ticket_comments";