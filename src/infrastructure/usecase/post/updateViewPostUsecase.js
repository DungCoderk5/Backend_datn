const postRepository = require('../../repository/postRepository');

async function updateViewPostUsecase(post_id) {
  if (!post_id) {
    throw new Error("post_id is required");
  }

  return await postRepository.updateViewPost(post_id);
}

module.exports = updateViewPostUsecase;