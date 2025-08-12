const productRepository = require("../../repository/productRepository");

async function getDealProductsUsecase({ page = 1, limit = 20, sort = "asc" }) {
  return await productRepository.findDealProducts({ page, limit, sort });
}


module.exports = getDealProductsUsecase;
