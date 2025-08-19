
const sizeRepository = require('../../repository/productRepository');

async function getAllSizesUsecase() {
  return await sizeRepository.findAllWithoutPaging();
}

module.exports = getAllSizesUsecase;
