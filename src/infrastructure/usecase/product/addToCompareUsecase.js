const productRepository = require('../../repository/productRepository');

async function addToCompareUsecase({ user_id, product_id }) {
  return await productRepository.addToComparelist({ user_id, product_id });
}

module.exports = addToCompareUsecase;