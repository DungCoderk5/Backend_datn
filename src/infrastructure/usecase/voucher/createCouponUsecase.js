const couponRepository = require('../../repository/couponRepository');

async function createCouponUsecase(data) {
  return await couponRepository.create(data);
}

module.exports = createCouponUsecase;
