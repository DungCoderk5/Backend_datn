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
    subject: "Xác nhận đăng ký tài khoản - Terashoes",
    html: `
  <div style="max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;font-family:sans-serif;background-color:#ffffff;">
    <div style="text-align:center;padding-bottom:20px;">
      <img src="${process.env.NEXTAUTH_URL}/uploads/logo-xanh.png" alt="Terashoes Logo" style="max-width:150px;height:auto;" />
    </div>
    <h2 style="color:#005b96;text-align:center;">Xác nhận đăng ký tài khoản</h2>
    <p style="font-size:16px;color:#333;">Xin chào <strong>${name}</strong>,</p>
    <p style="font-size:16px;color:#333;">
      Cảm ơn bạn đã đăng ký tài khoản tại <strong>Terashoes</strong>. Vui lòng xác nhận email của bạn bằng cách nhấp vào liên kết dưới đây:
    </p>
    <div style="text-align:center;margin:20px 0;">
      <a href="${process.env.FRONTEND_URL}" style="display:inline-block;background-color:#005b96;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:16px;">
        Xác nhận email
      </a>
    </div>
    <p style="font-size:16px;color:#333;">
      Hoặc sử dụng mã xác nhận sau:
    </p>
    <div style="text-align:center;font-size:20px;font-weight:bold;color:#005b96;margin:10px 0;">
      ${OTP}
    </div>
    <p style="font-size:16px;color:#333;">
      Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.
    </p>
    <hr style="margin:30px 0;border:none;border-top:1px solid #eee;" />
    <p style="font-size:14px;color:#999;text-align:center;">
      Mọi thắc mắc xin liên hệ: <a href="mailto:terashoesshop@gmail.com" style="color:#005b96;">terashoesshop@gmail.com</a>
    </p>
    <p style="font-size:14px;color:#999;text-align:center;">© 2025 Terashoes. All rights reserved.</p>
  </div>
  `,
  });

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
      status: 0,
      verify_otp: OTP,
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
      status: user.status,
    },
  };
}

module.exports = registerUsecase;
