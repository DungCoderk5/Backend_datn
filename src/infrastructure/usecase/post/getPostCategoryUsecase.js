// usecase/post/getPostCategoryUsecase.js

const postRepository = require("../../repository/postRepository");

async function getPostCategoryUsecase({ page, limit, id, name, status }) {
  const categories = await postRepository.findCate({ page, limit, id, name, status });

  if (!categories || categories.data.length === 0) {
    throw new Error("Không tìm thấy danh mục bài viết");
  }

  return categories; 
}

module.exports = getPostCategoryUsecase;
