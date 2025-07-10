const productRepository = require('../../repository/productRepository');

async function addProductUsecase(data) {
  const {...productData} = data;  
  return await productRepository.create(productData);
}

module.exports = addProductUsecase;
