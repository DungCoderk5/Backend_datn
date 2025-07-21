const userRepository = require("../../repository/userRepository");

async function updateAddressUsecase({ addressId, payload }) {
  return await userRepository.updateAddress(addressId, payload);
}

module.exports = updateAddressUsecase;