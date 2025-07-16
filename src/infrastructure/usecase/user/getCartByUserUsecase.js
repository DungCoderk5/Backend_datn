const userRepository = require('../../repository/userRepository');

async function getCartByUserUsecase({ userId }) {
  return await userRepository.findByUserId(userId);
}

module.exports = getCartByUserUsecase;