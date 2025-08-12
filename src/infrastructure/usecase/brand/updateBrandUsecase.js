const brandRepository = require('../../repository/brandRepository');

async function updateBrandUsecase({ brand_id, name, slug, logo_url, status }) {
  return await brandRepository.update({ brand_id, name, slug, logo_url, status });
}

module.exports = updateBrandUsecase;