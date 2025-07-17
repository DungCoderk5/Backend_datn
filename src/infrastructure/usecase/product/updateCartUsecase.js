const productRepository = require('../../repository/productRepository');

async function updateCartUsecase({ user_id, product_id, quantity }) {
  if (quantity < 1) {
    return await productRepository.removeFromCart({ user_id, product_id });
  }

  return await productRepository.updateCart({ user_id, product_id, quantity });
}

module.exports = updateCartUsecase;
