const postRepository = require("../../repository/postRepository");

async function getPostByCategoryUsecase(category_post_id) {
  const post = await postRepository.findByCate(category_post_id);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
}

module.exports = getPostByCategoryUsecase;