/*
  Warnings:
  - Added the required column `addressSnapshot` to the `Order` table.
  - Added the required column `deliveryAddressId` to the `Order` table.
  - Backfilled using a placeholder Address per user with existing orders.
*/

-- Step 1: Create Address table first (needed before we can backfill)
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- Step 2: FK from Address -> User
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 3: Add new Order columns as NULLABLE first (since Order already has rows)
ALTER TABLE "Order" ADD COLUMN "addressSnapshot" TEXT;
ALTER TABLE "Order" ADD COLUMN "deliveryAddressId" INTEGER;

-- Step 4: Create one placeholder Address per user who already has orders
INSERT INTO "Address" ("userId", "addressLine1", "city", "state", "pincode", "country", "isDefault", "createdAt", "updatedAt")
SELECT DISTINCT o."userId", 'Legacy order — address not recorded', 'Unknown', 'Unknown', '000000', 'India', false, now(), now()
FROM "Order" o;

-- Step 5: Point existing orders at their user's placeholder address
UPDATE "Order" o
SET "deliveryAddressId" = a."id",
    "addressSnapshot" = 'Legacy order — address not recorded'
FROM "Address" a
WHERE a."userId" = o."userId"
  AND a."addressLine1" = 'Legacy order — address not recorded';

-- Step 6: Now that every row has a value, enforce NOT NULL
ALTER TABLE "Order" ALTER COLUMN "addressSnapshot" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "deliveryAddressId" SET NOT NULL;

-- Step 7: FK from Order -> Address
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAddressId_fkey"
  FOREIGN KEY ("deliveryAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;