// usecase/post/getPostsByCategoryUsecase.js
const postRepository = require("../../repository/postRepository");

async function getPostsByCategoryUsecase({ page, limit, categoryId, slug, sortBy, sortOrder }) {
  const posts = await postRepository.findByCategory({
    page,
    limit,
    categoryId,
    slug,
    sortBy,
    sortOrder,
  });

  if (!posts || posts.posts.length === 0) {
    throw new Error("Không tìm thấy bài viết trong danh mục");
  }

  return posts;
}

module.exports = getPostsByCategoryUsecase;
