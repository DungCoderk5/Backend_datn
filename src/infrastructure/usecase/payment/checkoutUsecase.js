const productRepository = require("../../repository/productRepository");

async function checkoutUsecase({
  user_id,
  shipping_address_id,
  payment_method,
  coupon_code,
  shipping_fee = 0,
  comment = "",
}) {
  const cartItems = await productRepository.getCartItemsByUserId(user_id);

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Giỏ hàng trống");
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.variant.product;
    const unitPrice = product.sale_price ?? product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  let discount = 0;
  let coupon_id = null;



  const total_price = subtotal - discount + shipping_fee;

  const orderItems = cartItems.map((item) => {
    const product = item.variant.product;
    const unitPrice = product.sale_price ?? product.price;
    return {
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: unitPrice,
    };
  });

  const newOrder = await productRepository.createOrder({
    user_id,
    total_price,
    payment_method_id: payment_method.id,
    shipping_address_id,
    coupons_id: coupon_id,
    comment,
    items: orderItems,
  });

  await productRepository.clearCart(user_id);

  return newOrder;
}

module.exports = checkoutUsecase;
