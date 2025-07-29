const categoryRepository = require('../../repository/categoryRepository');

async function updateCategoriesUsecase({categories_id, name, slug, parent_id}) {
  return await categoryRepository.update({categories_id, name, slug, parent_id});
}

module.exports = updateCategoriesUsecase;