const productRepository = require('../../repository/productRepository');

async function getBestSellingUsecase(top = 3) {
  return await productRepository.getBestSelling(top);
}

module.exports = getBestSellingUsecase;
