const productRepository = require('../../repository/productRepository');

async function searchProductsUsecase({ keyword, page = 1, limit = 20 }) {
  return await productRepository.searchByKeyword({ keyword, page, limit });
}

module.exports = searchProductsUsecase;
