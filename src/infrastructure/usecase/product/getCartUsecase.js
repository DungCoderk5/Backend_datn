const productRepository = require('../../repository/productRepository');

async function getCartUsecase(user_id) {
  const cartItems = await productRepository.getCartItemsByUserId(user_id);
  return cartItems;
}

module.exports = getCartUsecase;
