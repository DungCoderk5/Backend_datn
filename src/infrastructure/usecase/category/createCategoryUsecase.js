const categoryRepository = require("../../repository/categoryRepository");

async function createCategoryUsecase({ name, slug, parent_id, image, status }) {
  return await categoryRepository.create({
    name,
    slug,
    parent_id,
    image,
    status,
  });
}


module.exports = createCategoryUsecase;
