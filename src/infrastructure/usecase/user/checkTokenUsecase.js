const jwt = require("jsonwebtoken");
const userRepository = require("../../repository/userRepository");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

async function checkTokenUsecase(req) {
  let token = req.cookies?.token;

  if (!token && req.body?.token) {
    token = req.body.token;
  }

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts[0] === "Bearer" && parts[1]) {
      token = parts[1];
    }
  }
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
        avatar: user.avatar || user.picture,
        role: user.role,
        phone: user.phone,
      },
    };
  } catch (err) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
}

module.exports = checkTokenUsecase;
