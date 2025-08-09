const brandRepository = require("../../repository/brandRepository");

async function deleteBrandUsecase(brand_id) {
  return await brandRepository.delete(brand_id);
}

module.exports = deleteBrandUsecase;
