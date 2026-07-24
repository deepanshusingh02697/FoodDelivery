/*
  Warnings:

  - You are about to drop the column `orderId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,restaurantId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_orderId_fkey";

-- DropIndex
DROP INDEX "Review_orderId_key";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "orderId";

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_restaurantId_key" ON "Review"("userId", "restaurantId");
