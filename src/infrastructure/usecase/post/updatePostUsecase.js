const postRepository = require("../../repository/postRepository");

async function updatePostUsecase(post_id,{
  title,
  slug,
  content,
  thumbnail,
  images,
  category_post_id,
  author_id,
  status = 1,
}) {
  const newPost = await postRepository.update(post_id,{
    title,
    slug,
    content,
    thumbnail,
    images,
    category_post_id,
    author_id,
    status,
  });

  return newPost;
}

module.exports = updatePostUsecase;
