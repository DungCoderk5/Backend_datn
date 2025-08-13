/*
  Warnings:

  - Made the column `content` on table `product_reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product_reviews` MODIFY `content` TEXT NOT NULL;
