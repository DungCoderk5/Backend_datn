const userRepository = require('../../repository/userRepository');

async function confirmEmailUsecase(email, token) {
  return await userRepository.confirm(email, token);
}

module.exports = confirmEmailUsecase;