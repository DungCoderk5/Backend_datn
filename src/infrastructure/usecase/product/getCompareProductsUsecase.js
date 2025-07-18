const productRepository = require('../../repository/productRepository');

async function getCompareProductsUsecase(user_id) {
  if (!user_id) {
    return { error: 'Thiếu user_id' };
  }

  const products = await productRepository.getCompareProductsByUser(user_id);
  return products;
};

module.exports = getCompareProductsUsecase;