const productRepository = require('../../repository/productRepository');

async function createProductReviewUsecase({ user_id, product_id, rating, content }) {
  return await productRepository.createReview({ user_id, product_id, rating, content });
}

module.exports = createProductReviewUsecase;
