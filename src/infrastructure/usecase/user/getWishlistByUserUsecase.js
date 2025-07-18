const userRepository = require('../../repository/userRepository');

async function getWishlistByUserUsecase(user_id) {
  return await userRepository.findWishlistByUserId(user_id);
}

module.exports = getWishlistByUserUsecase;