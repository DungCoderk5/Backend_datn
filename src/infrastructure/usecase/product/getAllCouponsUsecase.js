const productRepository = require("../../repository/productRepository");

async function getAllCouponsUsecase() {
  return await productRepository.findAllCoupons();
}

module.exports = getAllCouponsUsecase;
