const productRepository = require('../../repository/productRepository');

async function getUserVouchersUsecase(userId, page, limit) {
  return await productRepository.findUserVouchers(userId, page, limit);
}

module.exports = getUserVouchersUsecase;
