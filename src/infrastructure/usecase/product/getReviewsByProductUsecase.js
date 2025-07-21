const productRepository = require('../../repository/productRepository');

async function getReviewsByProductUsecase({ productId }) {
  return await productRepository.findReviewsByProductId(productId);
}

module.exports = getReviewsByProductUsecase;