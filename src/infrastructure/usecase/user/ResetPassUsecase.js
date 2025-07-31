const userRepository = require("../../repository/userRepository");
const bcrypt = require('bcryptjs');


async function ResetPassUsecase(email, OTP, newPassword) {
  const user = await userRepository.findByEmail(email);  
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    if (user.verify_otp !== OTP) {
      throw new Error("Token xác nhận không hợp lệ");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.ResetPass(email, hashedPassword);
}

module.exports = ResetPassUsecase;
