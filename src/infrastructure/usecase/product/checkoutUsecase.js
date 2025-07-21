const productRepository = require('../../repository/productRepository');

async function checkoutUsecase({ user_id, shipping_address, payment_method }) {
  const cartItems = await productRepository.getCartItemsByUserId(user_id);

  if (!cartItems || cartItems.length === 0) {
    throw new Error('Giỏ hàng trống');
  }

  const total_price = cartItems.reduce((sum, item) => {
    return sum + item.variant.product.price * item.quantity;
  }, 0);
  
  const newOrder = await productRepository.createOrder({
    user_id,
    total_price,
    shipping_address,
      payment_method_id: payment_method.id,
    items: cartItems.map((item) => ({
      variant_id: item.variant_id, // đúng với model order_items
      quantity: item.quantity,
      price: item.variant.product.price,
    })),
  });

  // Xoá giỏ hàng
  await productRepository.clearCart(user_id);

  return newOrder;
}


module.exports = checkoutUsecase;
