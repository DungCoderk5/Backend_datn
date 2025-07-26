const categoryRepository = require('../../repository/categoryRepository');

async function createCategoriesUsecase({name, slug, parent_id}) {
  return await categoryRepository.create({name, slug, parent_id});
}

module.exports = createCategoriesUsecase;