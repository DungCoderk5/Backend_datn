const userRepository = require("../../repository/userRepository");

async function updateOrderStatusUsecase(orderId, status) {
  return await userRepository.updateOrderStatus(orderId, status);
}

module.exports = updateOrderStatusUsecase;
