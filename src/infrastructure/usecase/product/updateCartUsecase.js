const productRepository = require('../../repository/productRepository');

async function updateCartUsecase({ user_id, variant_id, quantity }) {
  if (quantity < 1) {
    return await productRepository.removeFromCart({ user_id, variant_id });
  }

  return await productRepository.updateCartItem({ user_id, variant_id, quantity });
}

module.exports = updateCartUsecase;
