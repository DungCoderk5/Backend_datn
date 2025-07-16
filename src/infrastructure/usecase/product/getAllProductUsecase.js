const productRepository = require('../../repository/productRepository');

async function getAllProductsUsecase({ page = 1, limit = 20 }) {
  return await productRepository.findAll({ page, limit });
}

module.exports = getAllProductsUsecase;
