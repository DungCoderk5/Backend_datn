const productRepository = require('../../repository/productRepository');

async function removeFromCompareUsecase({ user_id, product_id }) {
  if (!user_id || !product_id) {
    return { error: 'Thiếu user_id hoặc product_id' };
  }
  return await productRepository.deleteFromCompare({ user_id, product_id });
}

module.exports = removeFromCompareUsecase;