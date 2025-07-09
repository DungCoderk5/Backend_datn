const productRepository = require('../../repository/productRepository');

async function getRelatedProductsUsecase({ productId, page = 1, limit = 20 }) {
  return await productRepository.findRelatedProducts(productId, page, limit);
}


module.exports = getRelatedProductsUsecase;
