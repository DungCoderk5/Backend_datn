const postRepository = require("../../repository/postRepository");

async function getPostByIdUsecase(post_id) {
  const post = await postRepository.findById(post_id);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
}

module.exports = getPostByIdUsecase;