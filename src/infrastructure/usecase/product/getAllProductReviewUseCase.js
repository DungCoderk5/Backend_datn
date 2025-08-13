const productRepository = require("../../repository/productRepository");

async function getAllProductReviewUsecase({
  page,
  limit,
  product_reviews_id,
  user_name,
  product_name,
  rating,
  search,
  sortBy,
  sortOrder,
}) {
  return await productRepository.findAllReview({
    page,
    limit,
    product_reviews_id,
    user_name,
    product_name,
    rating,
    search,
    sortBy,
    sortOrder,
  });
}

module.exports = getAllProductReviewUsecase;
