const userRepository = require('../../repository/userRepository');

async function getAllUsersUsecase({ page = 1, limit = 20, sortField, sortDirection, filters }) {
  return await userRepository.findAllUsers({ page, limit, sortField, sortDirection, filters });
}
module.exports = getAllUsersUsecase;
