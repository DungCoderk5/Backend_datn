const productRepository = require("../../repository/productRepository");

async function getOrdersByUserUsecase({ userId, skip, take, filters, sort, search }) {
  return await productRepository.findByUserId(userId, skip, take, filters, sort, search);
}

module.exports = getOrdersByUserUsecase;
