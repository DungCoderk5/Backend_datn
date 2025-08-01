const postRepository = require("../../repository/postRepository");

async function getAllPostsUsecase(post_id) {
  const post = await postRepository.findById(post_id);
  console.log(post);
  
  if (!post) {
    throw new Error( "Bài viết không tồn tại." );
  }
  return await postRepository.delete(post_id);
}

module.exports = getAllPostsUsecase;
