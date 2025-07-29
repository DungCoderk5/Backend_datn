const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../../shared/prisma");
const userRepository = require("../../repository/userRepository");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

async function registerUsecase(data, res) {
  const { name, email, password, phone } = data;

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) throw new Error("Email đã tồn tại");

  const hashedPassword = await bcrypt.hash(password, 10);
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();

  const sendEmail = await userRepository.sendMail({
    to: email,
    subject: "Xác nhận đăng ký tài khoản",
    html: `<p>Xin chào ${name},</p>
           <p>Cảm ơn bạn đã đăng ký tài khoản tại DATN Store. Vui lòng xác nhận email của bạn bằng cách nhấp vào liên kết dưới đây:</p>
           <a href="${process.env.FRONTEND_URL}">Xác nhận email</a>
           <p>Nếu bạn không thấy email, vui lòng kiểm tra thư mục spam hoặc rác của bạn.</p>
           <p>Token xác nhận: ${OTP}</p>
           <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
           <p>Trân trọng,</p>
           <p>DATN Store</p>`,
          })

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
      status: 0,
      verify_otp: OTP
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
