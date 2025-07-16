const productRepository = require('../../repository/productRepository');

async function getNewestProductsUsecase({ page = 1, limit = 20 }) {
  return await productRepository.getNewest({ page, limit });
}

module.exports = getNewestProductsUsecase;
