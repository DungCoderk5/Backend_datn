const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../../repository/userRepository");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

async function loginUsecase({ usernameOrEmail, password }, res) {
  const user = await userRepository.findByUsernameOrEmail(usernameOrEmail);
  if (!user) throw new Error("Tài khoản không tồn tại");
  if (!user.status) throw new Error("Tài khoản đã bị khóa");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Mật khẩu không đúng");

  const token = jwt.sign(
    {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "9999 years" } // không hết hạn
  );

  // Lưu vào cookie vĩnh viễn
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return {
    message: "Đăng nhập thành công",
    token,
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = loginUsecase;
