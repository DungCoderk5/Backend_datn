const productRepository = require("../../repository/productRepository");

async function getCouponsUsecase(code, total) {
  const cartItems = await productRepository.getCouponsByCode(code, total);
  return cartItems;
}

module.exports = getCouponsUsecase;
