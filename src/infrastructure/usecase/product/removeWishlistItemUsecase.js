const productRepository = require('../../repository/productRepository');

async function removeWishlistItemUsecase(userId, productId) {
  return await productRepository.deleteByUserAndProduct(userId, productId);
}

module.exports = removeWishlistItemUsecase;
