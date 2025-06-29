const userRepository = require("../../infrastructure/repository/userRepository");

const loginUsecase = require("../../infrastructure/usecase/user/loginUsecase");
const registerUsecase = require("../../infrastructure/usecase/user/registerUsecase");
const updateUserUsecase = require("../../infrastructure/usecase/user/updateUserUsecase");
const addAddressUsecase = require("../../infrastructure/usecase/user/addAddressUsecase");
const checkTokenUsecase = require("../../infrastructure/usecase/user/checkTokenUsecase");
const GoogleAuthUsecase = require("../../infrastructure/usecase/user/googleAuthUsecase");
const GoogleAuthRepository = require("../../infrastructure/repository/googleAuthRepository");

// Tạo repository và usecase
const googleAuthRepository = new GoogleAuthRepository();
const googleAuthUsecase = new GoogleAuthUsecase(googleAuthRepository);
async function googleCallback(req, res) {
  try {
    const { code } = req.body;
    const client_id =
      "235575927586-1ldvr8n16m7ose9db21aa0nvqhnb9m0a.apps.googleusercontent.com";
    const client_secret = "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";
    const redirect_uri = "http://localhost:3001/google/callback";
    const jwtSecret = process.env.JWT_SECRET || "YOUR_JWT_SECRET";

    const result = await googleAuthUsecase.handleGoogleLogin(
      code,
      client_id,
      client_secret,
      redirect_uri,
      jwtSecret
    );
    res.cookie("token",  result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // chỉ HTTPS khi production
      sameSite: "strict", // hoặc "strict"
      maxAge: 3600 * 1000, // 1 giờ
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: err.message || "Đăng nhập Google thất bại" });
  }
}
async function loginHandler(req, res) {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = await loginUsecase({ usernameOrEmail, password }, res);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
async function checkTokenHandler(req, res) {
  try {
    const result = await checkTokenUsecase(req);

    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message || "Token không hợp lệ hoặc đã hết hạn",
    });
  }
}


async function logoutHandler(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Đăng xuất thành công" });
}

async function registerHandler(req, res) {
  try {
    const result = await registerUsecase(req.body, res);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateUserHandler(req, res) {
  try {
    const { userId, ...userData } = req.body;

    if (!userId) return res.status(400).json({ error: "Thiếu userId" });

    const result = await updateUserUsecase(userId, userData);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const addAddressHandler = async (req, res) => {
  const userId = req.user?.user_id || req.body.user_id; // tuỳ vào middleware xác thực
  const { full_name, phone, address_line, is_default } = req.body;

  if (!userId || !full_name || !phone || !address_line) {
    return res.status(400).json({ error: "Thiếu thông tin địa chỉ" });
  }

  try {
    const result = await addAddressUsecase(userRepository)(userId, {
      full_name,
      phone,
      address_line,
      is_default: is_default ?? false,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Lỗi server" });
  }
};

module.exports = {
  loginHandler,
  logoutHandler,
  registerHandler,
  updateUserHandler,
  addAddressHandler,
  checkTokenHandler,
  googleCallback,
};
