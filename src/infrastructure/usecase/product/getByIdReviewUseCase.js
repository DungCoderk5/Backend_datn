const productRepository = require("../../repository/productRepository");
async function getByIdReviewUsecase(product_reviews_id){
    const product = await productRepository.findByIdReview(product_reviews_id);
    return product;
}
module.exports = getByIdReviewUsecase;
