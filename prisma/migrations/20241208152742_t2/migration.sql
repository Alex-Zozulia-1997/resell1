-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "amount_paid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions_plans" ALTER COLUMN "amount" DROP NOT NULL;
