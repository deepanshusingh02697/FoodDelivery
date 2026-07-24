-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryAddressId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
