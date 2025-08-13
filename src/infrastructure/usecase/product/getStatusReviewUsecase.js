const productRepository = require('../../repository/productRepository');

async function getStatusReviewUsecase(product_reviews_id, status) {
  return await productRepository.getStatusReview(product_reviews_id, status);
}

module.exports = getStatusReviewUsecase;
