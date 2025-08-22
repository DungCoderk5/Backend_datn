// loginUsecase.js
const bcrypt = require("bcrypt");
const { SignJWT } = require("jose");
const userRepository = require("../../repository/userRepository");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

async function loginUsecase({ usernameOrEmail, password }, res) {
  // 1. Lấy user
  const user = await userRepository.findByUsernameOrEmail(usernameOrEmail);
  if (!user) throw new Error("Tài khoản không tồn tại");
  if (!user.status) throw new Error("Tài khoản đã bị khóa");

  // 2. Kiểm tra password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Mật khẩu không đúng");

  // 3. Tạo token bằng jose
  const secret = new TextEncoder().encode(JWT_SECRET);

  const token = await new SignJWT({
    userId: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // token hết hạn sau 7 ngày
    .sign(secret);

  // 4. Lưu vào cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });

  return {
    message: "Đăng nhập thành công",
    token,
  };
}

module.exports = loginUsecase;
