const categoryRepository = require("../../repository/categoryRepository");

async function deleteCategoryUsecase(categories_id) {
  return await categoryRepository.delete(categories_id);
}

module.exports = deleteCategoryUsecase;
