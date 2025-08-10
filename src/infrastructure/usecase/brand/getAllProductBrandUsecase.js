const brandRepository = require("../../repository/brandRepository");

async function getAllProductBrandUsecase(filters) {
  return await brandRepository.findAll(filters);
}

module.exports = getAllProductBrandUsecase;
