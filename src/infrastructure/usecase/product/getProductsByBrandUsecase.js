const productRepository = require('../../repository/productRepository');

async function getProductsByBrandUsecase({ brandId, page, limit }) {
  return await productRepository.findByBrand(brandId, page, limit);
}

module.exports = getProductsByBrandUsecase;
