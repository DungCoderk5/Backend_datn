const productRepository = require('../../repository/productRepository');

async function removeFromCartUsecase({ user_id, product_id }) {
  return await productRepository.removeFromCart({ user_id, product_id });
}

module.exports = removeFromCartUsecase;
