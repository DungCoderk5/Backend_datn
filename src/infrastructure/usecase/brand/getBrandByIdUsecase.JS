const brandRepository = require('../../repository/brandRepository');

async function getBrandByIdUsecase({ brand_id }) {
  return await brandRepository.findById(brand_id);
}

module.exports = getBrandByIdUsecase;
