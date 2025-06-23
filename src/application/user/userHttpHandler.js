const userRepository = require('../../infrastructure/repository/userRepository');

const loginUsecase = require("../../infrastructure/usecase/user/loginUsecase");
const registerUsecase = require("../../infrastructure/usecase/user/registerUsecase");
const updateUserUsecase = require("../../infrastructure/usecase/user/updateUserUsecase");
const addAddressUsecase = require('../../infrastructure/usecase/user/addAddressUsecase');

async function loginHandler(req, res) {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = await loginUsecase({ usernameOrEmail, password }, res);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
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
    return res.status(400).json({ error: 'Thiếu thông tin địa chỉ' });
  }

  try {
    const result = await addAddressUsecase(userRepository)(userId, {
      full_name,
      phone,
      address_line,
      is_default: is_default ?? false
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
};
