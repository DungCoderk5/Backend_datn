const productRepository = require('../../repository/productRepository');

async function addProductToCart(data) {
  const {...productData} = data;  
  return await productRepository.addToCart(productData);
}

module.exports = addProductToCart;
