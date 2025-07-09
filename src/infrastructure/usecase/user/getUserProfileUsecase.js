const userRepository = require('../../repository/userRepository');

async function getUserProfileUsecase({ userId }) {
  return await userRepository.findBasicInfo(userId);
}

module.exports = getUserProfileUsecase;