const categoryRepository = require("../../repository/categoryRepository");

async function getCategoryByIdUsecase({ categories_id }) {
  return await categoryRepository.findById(categories_id);
}

module.exports = getCategoryByIdUsecase;
