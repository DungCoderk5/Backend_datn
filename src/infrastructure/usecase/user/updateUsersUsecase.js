const userRepository = require('../../repository/userRepository');

async function updateUserUsecase(userId, data) {
  return await userRepository.updateUser(userId, data);
}

module.exports = updateUserUsecase;
