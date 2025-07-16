const productRepository = require('../../repository/productRepository');

async function getFeaturedProductsUsecase() {
  return await productRepository.getFeaturedProducts();
}

module.exports = getFeaturedProductsUsecase;
