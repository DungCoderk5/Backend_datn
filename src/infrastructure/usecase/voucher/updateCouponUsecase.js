const couponRepository = require("../../repository/couponRepository");

async function updateCouponUsecase(id, data) {
  return await couponRepository.update(id, data);
}

module.exports = updateCouponUsecase;
