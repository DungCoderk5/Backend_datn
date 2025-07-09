const userRepository = require("../../repository/userRepository");

async function getAddressesByUserUsecase({ userId }) {
  return await userRepository.findAddressByUserId(userId);
}

module.exports = getAddressesByUserUsecase;