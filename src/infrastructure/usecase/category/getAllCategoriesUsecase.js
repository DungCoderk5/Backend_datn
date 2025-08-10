const categoryRepository = require("../../repository/categoryRepository");

async function getAllCategoriesUsecase() {
  return await categoryRepository.findAllWithoutPaging();
}

module.exports = getAllCategoriesUsecase;
 