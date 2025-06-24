const jwt = require("jsonwebtoken");
const userRepository = require("../../repository/userRepository");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

async function checkTokenUsecase(req) {
  const token = req.cookies?.token;
  if (!token) throw new Error("Token không tồn tại");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await userRepository.findById(decoded.userId);
    if (!user) throw new Error("Người dùng không tồn tại");

    if (!user.status) throw new Error("Tài khoản đã bị khóa");

    return {
      message: "Token hợp lệ",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
      },
    };
  } catch (err) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
}

module.exports = checkTokenUsecase;
