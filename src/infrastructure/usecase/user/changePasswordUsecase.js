// src/infrastructure/usecase/user/changePasswordUsecase.js
const bcrypt = require('bcryptjs');
const userRepository = require('../../repository/userRepository');

async function changePasswordUsecase({ userId, oldPassword, newPassword }) {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  
  if (!isMatch) throw new Error('Mật khẩu cũ không đúng');

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(userId, hashedNewPassword);

  return { message: 'Đổi mật khẩu thành công' };
}

module.exports = changePasswordUsecase;

