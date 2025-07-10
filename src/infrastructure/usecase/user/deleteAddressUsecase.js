const userRepository = require("../../repository/userRepository");

async function deleteAddressUsecase({ addressId }) {
  return await userRepository.deleteAddress(addressId);
}

module.exports = deleteAddressUsecase;