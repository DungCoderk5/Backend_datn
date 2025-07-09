const categoryRepository = require('../../repository/categoryRepository');

async function getAllProductCategoriesUsecase() {
  return await categoryRepository.findAll();
}

module.exports = getAllProductCategoriesUsecase;