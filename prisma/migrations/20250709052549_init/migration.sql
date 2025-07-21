/*
  Warnings:

  - You are about to drop the column `image` on the `colors` table. All the data in the column will be lost.
  - You are about to alter the column `code_color` on the `colors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `name_color` on the `colors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `code` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `genders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `post_id` on the `images` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `images` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `name_method` on the `payment_method` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `image` on the `posts` table. All the data in the column will be lost.
  - You are about to alter the column `sku` on the `product_variants` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `number_size` on the `sizes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- DropIndex
DROP INDEX `cart_items_cart_id_fkey` ON `cart_items`;

-- DropIndex
DROP INDEX `cart_items_variant_id_fkey` ON `cart_items`;

-- DropIndex
DROP INDEX `carts_user_id_fkey` ON `carts`;

-- DropIndex
DROP INDEX `categories_parent_id_fkey` ON `categories`;

-- DropIndex
DROP INDEX `categories_post_parent_id_fkey` ON `categories_post`;

-- DropIndex
DROP INDEX `images_post_id_fkey` ON `images`;

-- DropIndex
DROP INDEX `images_product_id_fkey` ON `images`;

-- DropIndex
DROP INDEX `order_items_order_id_fkey` ON `order_items`;

-- DropIndex
DROP INDEX `order_items_variant_id_fkey` ON `order_items`;

-- DropIndex
DROP INDEX `orders_coupons_id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `orders_payment_method_id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `orders_shipping_address_id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `orders_user_id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `posts_author_id_fkey` ON `posts`;

-- DropIndex
DROP INDEX `posts_category_post_id_fkey` ON `posts`;

-- DropIndex
DROP INDEX `product_reviews_product_id_fkey` ON `product_reviews`;

-- DropIndex
DROP INDEX `product_variants_color_id_fkey` ON `product_variants`;

-- DropIndex
DROP INDEX `product_variants_product_id_fkey` ON `product_variants`;

-- DropIndex
DROP INDEX `product_variants_size_id_fkey` ON `product_variants`;

-- DropIndex
DROP INDEX `products_brand_id_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_categories_id_fkey` ON `products`;

-- DropIndex
DROP INDEX `products_gender_id_fkey` ON `products`;

-- DropIndex
DROP INDEX `ship_address_user_id_fkey` ON `ship_address`;

-- DropIndex
DROP INDEX `wishlist_items_product_id_fkey` ON `wishlist_items`;

-- DropIndex
DROP INDEX `wishlist_items_user_id_fkey` ON `wishlist_items`;

-- AlterTable
ALTER TABLE `brands` MODIFY `logo_url` TEXT NULL;

-- AlterTable
ALTER TABLE `cart_items` MODIFY `price` DECIMAL(10, 2) NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `carts` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `colors` DROP COLUMN `image`,
    ADD COLUMN `images` VARCHAR(191) NULL,
    MODIFY `code_color` VARCHAR(50) NULL,
    MODIFY `name_color` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `coupons` MODIFY `code` VARCHAR(100) NOT NULL,
    MODIFY `discount_value` DECIMAL(10, 2) NOT NULL,
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
ALTER TABLE `order_items` MODIFY `unit_price` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `status` VARCHAR(50) NOT NULL,
    MODIFY `total_amount` DECIMAL(10, 2) NOT NULL,
    MODIFY `comment` TEXT NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `payment_method` MODIFY `name_method` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `image`,
    ADD COLUMN `images` VARCHAR(191) NULL,
    MODIFY `content` TEXT NULL,
    MODIFY `thumbnail` TEXT NULL,
    MODIFY `status` TINYINT NULL DEFAULT 1,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `product_reviews` MODIFY `content` TEXT NULL,
    MODIFY `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `product_variants` MODIFY `sku` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `description` TEXT NULL,
    MODIFY `short_desc` TEXT NULL,
    MODIFY `price` DECIMAL(10, 2) NULL,
    MODIFY `sale_price` DECIMAL(10, 2) NULL,
    MODIFY `status` TINYINT NULL DEFAULT 1,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ship_address` MODIFY `address_line` TEXT NULL;

-- AlterTable
ALTER TABLE `sizes` MODIFY `number_size` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `address` TEXT NULL,
    MODIFY `status` TINYINT NULL DEFAULT 1,
    MODIFY `avatar` TEXT NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `wishlist_items` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`categories_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categories_id_fkey` FOREIGN KEY (`categories_id`) REFERENCES `categories`(`categories_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`brand_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_gender_id_fkey` FOREIGN KEY (`gender_id`) REFERENCES `genders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_size_id_fkey` FOREIGN KEY (`size_id`) REFERENCES `sizes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`carts_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`product_variants_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ship_address` ADD CONSTRAINT `ship_address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_shipping_address_id_fkey` FOREIGN KEY (`shipping_address_id`) REFERENCES `ship_address`(`ship_address_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_coupons_id_fkey` FOREIGN KEY (`coupons_id`) REFERENCES `coupons`(`coupons_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`product_variants_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`orders_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories_post` ADD CONSTRAINT `categories_post_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories_post`(`category_post_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_category_post_id_fkey` FOREIGN KEY (`category_post_id`) REFERENCES `categories_post`(`category_post_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
