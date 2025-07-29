const userRepository = require("../../repository/userRepository");

async function sendResetPassUsecase(email) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();
  const to = user.email;
  const subject = "Password Reset Request";
  const html = `<p>Hi ${user.name},</p>
                <p>We received a request to reset your password. Click the link below to reset your password:</p>
                <p><a href="${process.env.RESETPASS}">Reset Password</a></p>
                <p>Your OTP is: ${OTP}</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you,</p>   
                <p>DATN Store</p>`;
    await userRepository.setOTP(email, OTP);
  return await userRepository.sendMail({ to, subject, html });
  
}

module.exports = sendResetPassUsecase;
