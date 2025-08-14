const categoryRepository = require("../../repository/categoryRepository");

async function updateCategoriesUsecase({
  categories_id,
  name,
  slug,
  parent_id,
  image,
  status,
}) {
  return await categoryRepository.update({
    categories_id,
    name,
    slug,
    parent_id,
    image,
    status,
  });
}

module.exports = updateCategoriesUsecase;
