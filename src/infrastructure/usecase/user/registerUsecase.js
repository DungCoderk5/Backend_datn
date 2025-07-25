const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../../shared/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

async function registerUsecase(data, res) {
  const { name, email, password, phone } = data;

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) throw new Error("Email đã tồn tại");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
      status: 0,
    },
  });

  const token = jwt.sign(
    {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "9999 years" }
  );

  // Lưu cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return {
    message: "Đăng ký thành công",
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    },
  };
}

module.exports = registerUsecase;
