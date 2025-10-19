/*
  Warnings:

  - You are about to drop the column `deliveryStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryStatus",
DROP COLUMN "paymentStatus",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending';
