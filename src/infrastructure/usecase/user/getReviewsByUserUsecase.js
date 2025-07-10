const userRepository = require('../../repository/userRepository');

async function getReviewsByUserUsecase({ userId }) {
  return await userRepository.findReviewsByUserId(userId);
}

module.exports = getReviewsByUserUsecase;