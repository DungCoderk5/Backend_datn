const userRepository = require("../../repository/userRepository");

async function getAddressesByIdUsecase(addressid) {
  return await userRepository.findAddressById(addressid);
}

module.exports = getAddressesByIdUsecase;