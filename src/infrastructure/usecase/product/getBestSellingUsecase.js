const productRepository = require('../../repository/productRepository');

async function getBestSellingUsecase(top = 6) {
  
  return await productRepository.getBestSelling(top);
}

module.exports = getBestSellingUsecase;
