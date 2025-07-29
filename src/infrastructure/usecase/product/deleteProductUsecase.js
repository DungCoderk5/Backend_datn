const productRepository = require('../../repository/productRepository');

async function deleteProductUsecase(products_id) {
  return await productRepository.delete(products_id);
}

module.exports = deleteProductUsecase;