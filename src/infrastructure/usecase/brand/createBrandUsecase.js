const brandRepository = require('../../repository/brandRepository');

async function createBrandUsecase({ name, slug, logo_url, status }) {
  return await brandRepository.create({ name, slug, logo_url, status });
}


module.exports = createBrandUsecase;