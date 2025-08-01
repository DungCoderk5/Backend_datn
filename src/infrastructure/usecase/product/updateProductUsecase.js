const productRepository = require('../../repository/productRepository');

async function updateProductUsecase({products_id, data}) {
  return await productRepository.update({products_id, data});
}

module.exports = updateProductUsecase;
