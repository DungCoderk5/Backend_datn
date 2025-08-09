const postRepository = require("../../repository/postRepository");

async function getPostByCategoryUsecase(category_post_id) {
  const posts = await postRepository.findByCate(category_post_id);
  if (!posts || posts.length === 0) {
    throw new Error("Không tìm thấy bài viết nào trong danh mục.");
  }
  return posts;
}

module.exports = getPostByCategoryUsecase;