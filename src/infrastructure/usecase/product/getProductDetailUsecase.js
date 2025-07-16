const productRepository = require('../../repository/productRepository');

async function getProductDetailUsecase(identifier) {
  if (!identifier || (!identifier.id && !identifier.slug)) {
    throw new Error('Vui lòng truyền id hoặc slug sản phẩm.');
  }

  const product = await productRepository.findByIdOrSlug(identifier);

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm.');
  }

  return product;
}

module.exports = getProductDetailUsecase;
