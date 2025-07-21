/*
  Warnings:

  - You are about to drop the column `image` on the `product_variants` table. All the data in the column will be lost.

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
ALTER TABLE `colors` ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product_variants` DROP COLUMN `image`;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`categories_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories_post` ADD CONSTRAINT `categories_post_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories_post`(`category_post_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_coupons_id_fkey` FOREIGN KEY (`coupons_id`) REFERENCES `coupons`(`coupons_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_shipping_address_id_fkey` FOREIGN KEY (`shipping_address_id`) REFERENCES `ship_address`(`ship_address_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`orders_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`product_variants_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_category_post_id_fkey` FOREIGN KEY (`category_post_id`) REFERENCES `categories_post`(`category_post_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categories_id_fkey` FOREIGN KEY (`categories_id`) REFERENCES `categories`(`categories_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`brand_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_gender_id_fkey` FOREIGN KEY (`gender_id`) REFERENCES `genders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_size_id_fkey` FOREIGN KEY (`size_id`) REFERENCES `sizes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ship_address` ADD CONSTRAINT `ship_address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`carts_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`product_variants_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`products_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
