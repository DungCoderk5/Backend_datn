const brandRepository = require('../../repository/brandRepository');

async function createBrandUsecase({name, slug, logo_url}) {
  return await brandRepository.create({name, slug, logo_url}); 
}

module.exports = createBrandUsecase;