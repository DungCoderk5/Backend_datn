const productRepository = require('../../repository/productRepository');

async function addProductUsecase(data) {
  return await productRepository.create(data);
}

module.exports = addProductUsecase;
