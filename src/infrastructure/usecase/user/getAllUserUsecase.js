const userRepository = require('../../repository/userRepository');

async function getAllUsersUsecase({ page = 1, limit = 20 }) {
  return await userRepository.findAllUsers({ page, limit });
}

module.exports = getAllUsersUsecase;
