const userRepository = require('../../repository/userRepository');

  async function getOrderDetail(orderId) {
    if (!orderId || isNaN(orderId)) {
      return { error: 'Invalid order ID.' };
    }

    const order = await userRepository.getOrderDetailById(orderId);

    if (!order) {
      return { error: 'Order not found.' };
    }

    return { data: order };
  }

module.exports = getOrderDetail;