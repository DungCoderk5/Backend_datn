const productRepository = require('../../repository/productRepository');

async function getProductsByGenderUsecase({ genderName, page = 1, limit = 20 }) {
  if (!genderName) {
    throw new Error('genderName is required');
  }

  return await productRepository.findProductsByGender({ genderName, page, limit });
}

module.exports = getProductsByGenderUsecase;
