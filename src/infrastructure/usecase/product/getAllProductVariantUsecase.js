const productRepository = require('../../repository/productRepository');

async function getAllProductVariantUsecase({ page = 1, limit = 5, sortField = "created_at", sortOrder = "desc", filters = {} }) {
  return await productRepository.findAllPro({ page, limit, sortField, sortOrder, filters });
}

module.exports = getAllProductVariantUsecase;
