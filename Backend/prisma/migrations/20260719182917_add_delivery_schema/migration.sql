/*
  Warnings:

  - You are about to drop the column `devliveredAt` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DELIVERY_PARTNER';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "devliveredAt",
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "deliveryPartnerId" INTEGER;

-- CreateTable
CREATE TABLE "DeliveryTracking" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryTracking_orderId_key" ON "DeliveryTracking"("orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTracking" ADD CONSTRAINT "DeliveryTracking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
