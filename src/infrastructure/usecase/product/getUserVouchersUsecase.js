const productRepository = require('../../repository/productRepository');

async function getUserVouchersUsecase(userId) {
  return await productRepository.findUserVouchers(userId);
}

module.exports = getUserVouchersUsecase;
