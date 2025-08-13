const productRepository = require('../../repository/productRepository');

async function createProductReviewUsecase({ user_id, product_id, rating, content,status="approved" }) {
  return await productRepository.createReview({ user_id, product_id, rating, content ,status});
}

module.exports = createProductReviewUsecase;
