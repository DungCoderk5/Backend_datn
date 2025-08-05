// infrastructure/usecase/user/addUserVoucherUsecase.js
const userVoucherRepository = require("../../../infrastructure/repository/userRepository");

async function addUserVoucherUsecase({ user_id, coupon_code }) {
  return await userVoucherRepository.addUserVoucher({ user_id, coupon_code });
}

module.exports = addUserVoucherUsecase;
