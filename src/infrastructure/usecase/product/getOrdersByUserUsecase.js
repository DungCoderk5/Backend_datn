const productRepository = require("../../repository/productRepository");

async function getOrdersByUserUsecase({ userId, skip, take }) {
  return await productRepository.findByUserId(userId, skip, take);
}

module.exports = getOrdersByUserUsecase;
