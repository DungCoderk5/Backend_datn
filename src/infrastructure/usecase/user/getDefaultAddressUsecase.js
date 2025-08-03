const userRepository = require('../../repository/userRepository');

async function getDefaultAddressUsecase(userId ) {
  return await userRepository.findDefaultAddress(userId);
}

module.exports = getDefaultAddressUsecase;