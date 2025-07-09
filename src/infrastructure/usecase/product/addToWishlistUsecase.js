const productRepository = require('../../repository/productRepository');

async function addToWishlistUsecase({ user_id, product_id }) {
  return await productRepository.addToWishlist({ user_id, product_id });
}

module.exports = addToWishlistUsecase;