const productRepository = require('../../repository/productRepository');

async function checkoutUsecase({
  user_id,
  shipping_address_id,
  payment_method,
  coupon_code,
  shipping_fee = 0,
}) {
  const cartItems = await productRepository.getCartItemsByUserId(user_id);

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Giỏ hàng trống");
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + item.variant.product.price * item.quantity;
  }, 0);

  // Xử lý mã giảm giá
  let discount = 0;
  let coupon_id = null;

  if (coupon_code) {
    const coupon = await productRepository.getVoucherByCode(coupon_code);

    if (coupon && coupon.usage_limit > coupon.used_count) {
      coupon_id = coupon.coupons_id;

      if (coupon.discount_type === "percentage") {
        discount = Math.floor((subtotal * coupon.discount_value) / 100);
      } else if (coupon.discount_type === "fixed") {
        discount = coupon.discount_value;
      }
    }
  }

  const total_price = subtotal - discount + shipping_fee;

  const newOrder = await productRepository.createOrder({
    user_id,
    total_price,
    payment_method_id: payment_method.id,
    shipping_address_id,
    coupons_id: coupon_id,
    items: cartItems.map((item) => ({
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.variant.product.price,
    })),
  });

  await productRepository.clearCart(user_id);

  return newOrder;
}

module.exports = checkoutUsecase;
