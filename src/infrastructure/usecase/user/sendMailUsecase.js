const userRepository = require("../../repository/userRepository");

async function sendMailUsecase({ to, subject, html }) {
  return await userRepository.sendMail({ to, subject, html });
}

module.exports = sendMailUsecase;
