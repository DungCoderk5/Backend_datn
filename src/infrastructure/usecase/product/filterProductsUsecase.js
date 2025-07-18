const productRepository = require('../../repository/productRepository');

async function filterProductsUsecase(filters) {
  return await productRepository.filterProducts(filters);
}

module.exports = filterProductsUsecase;
