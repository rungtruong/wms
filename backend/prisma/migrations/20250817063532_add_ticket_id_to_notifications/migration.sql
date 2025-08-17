-- AlterTable
ALTER TABLE "public"."notifications" ADD COLUMN     "ticket_id" UUID;

-- CreateIndex
CREATE INDEX "notifications_ticket_id_idx" ON "public"."notifications"("ticket_id");

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
