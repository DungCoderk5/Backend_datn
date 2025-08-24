const productRepository = require("../../repository/productRepository");

async function getProductDetailUsecase(productId) {
  if (!productId) {
    throw { status: 400, message: "Vui lòng truyền id sản phẩm." };
  }

  const product = await productRepository.findById(productId);

  if (!product) {
    throw { status: 404, message: "Không tìm thấy sản phẩm." };
  }

  return product;
}

module.exports = getProductDetailUsecase;
