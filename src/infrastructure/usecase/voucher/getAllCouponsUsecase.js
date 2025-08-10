const couponRepository = require('../../repository/couponRepository');

async function getAllCouponsUsecase(filters) {
  return await couponRepository.findAll(filters);
}

module.exports = getAllCouponsUsecase;
