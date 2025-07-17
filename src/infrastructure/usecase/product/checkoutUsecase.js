const productRepository = require('../../repository/productRepository');

async function checkoutUsecase({ user_id, shipping_address, payment_method }) {
  const cartItems = await productRepository.getCartItemsByUserId(user_id);

  if (cartItems.length === 0) {
    throw new Error('Giỏ hàng trống');
  }

  const total_price = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const newOrder = await productRepository.createOrder({
    user_id,
    total_price,
    shipping_address,
    payment_method,
    items: cartItems
  });

  // Xóa giỏ hàng sau khi thanh toán
  await productRepository.clearCart(user_id);

  return newOrder;
}

module.exports = checkoutUsecase;
