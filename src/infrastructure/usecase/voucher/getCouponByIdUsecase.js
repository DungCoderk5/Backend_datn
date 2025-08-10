const couponRepository = require("../../repository/couponRepository");

async function getCouponByIdUsecase(id) {
  // Có thể thêm validate hoặc xử lý nghiệp vụ khác ở đây
  return await couponRepository.findById(id);
}

module.exports = getCouponByIdUsecase;
