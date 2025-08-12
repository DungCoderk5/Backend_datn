const postRepository = require("../../repository/postRepository");

async function getPostBySlugUsecase(slug) {
  if (!slug) {
    throw new Error("Slug is required");
  }

  const post = await postRepository.findBySlug({ slug }); 
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
}

module.exports = getPostBySlugUsecase;