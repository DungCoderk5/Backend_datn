const productRepository = require('../../repository/productRepository');

async function filterProductsUsecase(filters) {
  return await productRepository.filteredProducts(filters);
}

module.exports = filterProductsUsecase;
