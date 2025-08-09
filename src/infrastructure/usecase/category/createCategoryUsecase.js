const categoryRepository = require("../../repository/categoryRepository");

async function createCategoryUsecase({ name, slug, parent_id, image }) {
  return await categoryRepository.create({ name, slug, parent_id, image });
}

module.exports = createCategoryUsecase;
