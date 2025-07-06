const postRepository = require('../../repository/postRepository');

async function getAllPostsUsecase({ page = 1, limit = 10 }) {
  return await postRepository.findAll({ page, limit });
}

module.exports = getAllPostsUsecase;