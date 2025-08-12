const productRepository = require("../../repository/productRepository");

async function getAllGendersUsecase() {
  return await productRepository.findAllGenders();
}

module.exports = getAllGendersUsecase;
