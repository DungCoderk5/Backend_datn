/*
  Warnings:

  - You are about to alter the column `code_color` on the `colors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `name_color` on the `colors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `code` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `genders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `post_id` on the `images` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `images` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `name_method` on the `payment_method` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `image` on the `product_variants` table. All the data in the column will be lost.
  - You are about to alter the column `sku` on the `product_variants` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `number_size` on the `sizes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - Made the column `price` on table `cart_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unit_price` on table `order_items` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_reviews` DROP FOREIGN KEY `product_reviews_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_reviews` DROP FOREIGN KEY `product_reviews_user_id_fkey`;

-- DropIndex
DROP INDEX `images_post_id_fkey` ON `images`;

-- DropIndex
DROP INDEX `product_reviews_product_id_fkey` ON `product_reviews`;

-- AlterTable
ALTER TABLE `brands` MODIFY `logo_url` TEXT NULL;

-- AlterTable
ALTER TABLE `cart_items` MODIFY `price` INTEGER NOT NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `carts` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `colors` ADD COLUMN `images` VARCHAR(191) NULL,
    MODIFY `code_color` VARCHAR(50) NULL,
    MODIFY `name_color` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `coupons` ADD COLUMN `min_order` INTEGER NOT NULL DEFAULT 0,
    MODIFY `code` VARCHAR(100) NOT NULL,
    MODIFY `discount_value` INTEGER NOT NULL,
    MODIFY `start_date` DATE NULL,
    MODIFY `end_date` DATE NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `genders` MODIFY `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `images` DROP COLUMN `post_id`,
    MODIFY `url` TEXT NULL,
    MODIFY `type` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `order_items` MODIFY `unit_price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `status` VARCHAR(50) NOT NULL,
    MODIFY `total_amount` INTEGER NOT NULL,
    MODIFY `comment` TEXT NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `payment_method` MODIFY `name_method` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `images` VARCHAR(191) NULL,
    MODIFY `content` TEXT NULL,
    MODIFY `thumbnail` TEXT NULL,
    MODIFY `status` TINYINT NULL DEFAULT 1,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `product_reviews` MODIFY `content` TEXT NULL,
    MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `product_variants` DROP COLUMN `image`,
    MODIFY `sku` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `description` TEXT NULL,
    MODIFY `short_desc` TEXT NULL,
    MODIFY `price` INTEGER NULL,
    MODIFY `sale_price` INTEGER NULL,
    MODIFY `status` TINYINT NULL DEFAULT 1,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ship_address` MODIFY `address_line` TEXT NULL;

-- AlterTable
ALTER TABLE `sizes` MODIFY `number_size` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `address`,
    ADD COLUMN `verify_otp` TEXT NULL,
    MODIFY `status` TINYINT NULL DEFAULT 1,
    MODIFY `avatar` TEXT NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `wishlist_items` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `product_compares` (
    `product_compare_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `product_compares_user_id_product_id_key`(`user_id`, `product_id`),
    PRIMARY KEY (`product_compare_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_compares` ADD CONSTRAINT `product_compares_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_compares` ADD CONSTRAINT `product_compares_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE CASCADE ON UPDATE CASCADE;
