const brandRepository = require('../../repository/brandRepository');

async function updateBrandUsecase({brand_id, name, slug, logo_url}) {
  return await brandRepository.update({brand_id, name, slug, logo_url}); 
}

module.exports = updateBrandUsecase;