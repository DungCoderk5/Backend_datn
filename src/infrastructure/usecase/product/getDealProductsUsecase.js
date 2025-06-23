const productRepository = require('../../repository/productRepository');

async function getDealProductsUsecase({ page = 1, limit = 20 }) {
  return await productRepository.findDealProducts({ page, limit });
}

module.exports = getDealProductsUsecase;
