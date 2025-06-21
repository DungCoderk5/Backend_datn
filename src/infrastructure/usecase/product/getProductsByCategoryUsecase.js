const productRepository = require('../../repository/productRepository');

async function getProductsByCategoryUsecase({ categoryName, page = 1, limit = 20 }) {
  if (!categoryName) throw new Error('categoryName is required');

  return await productRepository.findProductsByCategory({ categoryName, page, limit });
}

module.exports = getProductsByCategoryUsecase;
