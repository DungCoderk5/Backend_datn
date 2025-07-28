const productRepository = require("../../repository/productRepository");
async function removeFromCartUsecase({ user_id, variant_id }) {
  return await productRepository.removeFromCart({ user_id, variant_id });
}

module.exports = removeFromCartUsecase;
