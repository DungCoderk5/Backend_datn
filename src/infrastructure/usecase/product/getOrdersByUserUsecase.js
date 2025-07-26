const productRepository = require('../../repository/productRepository');

async function getOrdersByUserUsecase(userId) {
  return await productRepository.findByUserId(userId);
}

module.exports = getOrdersByUserUsecase;
