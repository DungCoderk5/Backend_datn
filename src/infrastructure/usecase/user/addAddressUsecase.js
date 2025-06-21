const addAddressUsecase = (userRepository) => {
  return async (userId, addressData) => {
    try {
      const newAddress = await userRepository.createAddress(userId, addressData);
      return {
        success: true,
        data: newAddress
      };
    } catch (error) {
      console.error("Usecase - Add Address Error:", error);
      throw new Error("Thêm địa chỉ thất bại");
    }
  };
};

module.exports = addAddressUsecase;
