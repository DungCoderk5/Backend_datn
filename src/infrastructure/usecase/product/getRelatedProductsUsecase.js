const productRepository = require('../../repository/productRepository');

async function getRelatedProductsUsecase({ categoryId, page = 1, limit = 20 }) {
  if (!categoryId) {
    throw new Error('categoryId is required');
  }

  return await productRepository.findRelatedProductsByCategory({ categoryId, page, limit });
}

module.exports = getRelatedProductsUsecase;
