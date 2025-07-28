const categoryRepository = require('../../repository/categoryRepository');

async function deleteCategoriesUsecase(categories_id) {
  return await categoryRepository.delete(categories_id);
}

module.exports = deleteCategoriesUsecase;