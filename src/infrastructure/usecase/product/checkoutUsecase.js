const productRepository = require("../../repository/productRepository");

// Hàm chuẩn bị đơn hàng, dùng để tạo dữ liệu tạm khi thanh toán online
async function prepareOrderData({
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

  if (coupon_code) {
    const coupon = await productRepository.getVoucherByCode(coupon_code);
    if (coupon && coupon.usage_limit > coupon.used_count) {
      coupon_id = coupon.coupons_id;
      discount = coupon.discount_type === "percentage"
        ? Math.floor((subtotal * coupon.discount_value) / 100)
        : coupon.discount_value;
    }
  }

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

  return {
    user_id,
    total_price,
    payment_method_id: payment_method.id,
    shipping_address_id,
    coupons_id: coupon_id,
    comment,
    items: orderItems,
  };
}

//Hàm tạo đơn hàng (dùng cho COD hoặc khi callback thành công)
async function createOrderFromData(orderData) {
  return await productRepository.createOrder(orderData);
}

module.exports = {
  prepareOrderData,
  createOrderFromData,
};
