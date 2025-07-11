const brandRepository = require('../../repository/brandRepository');

async function getAllProductBrandUsecase() {
  return await brandRepository.findAll();
}

module.exports = getAllProductBrandUsecase;