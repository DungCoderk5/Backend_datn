const postRepository = require("../../repository/postRepository");

async function getPostCategoryUsecase() {
  const categories = await postRepository.findCate();
  if (!categories) {
    throw new Error("category not found");
  }
  return categories;
}

module.exports = getPostCategoryUsecase;