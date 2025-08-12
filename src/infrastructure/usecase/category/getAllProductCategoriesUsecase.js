const categoryRepository = require('../../repository/categoryRepository');

async function getAllProductCategoriesUsecase(filters) {
  return await categoryRepository.findAll(filters);
}

module.exports = getAllProductCategoriesUsecase;
