const productRepository = require('../../repository/productRepository');

async function addProductToCart(data) {
  return await productRepository.addToCart(data);
}

module.exports = addProductToCart;
