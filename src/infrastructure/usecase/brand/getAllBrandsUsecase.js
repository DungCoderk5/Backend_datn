const brandRepository = require("../../repository/brandRepository");

async function getAllBrandsUsecase() {
  return await brandRepository.findAllWithoutPaging();
}

module.exports = getAllBrandsUsecase;
