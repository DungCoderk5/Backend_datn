const postRepository = require('../../repository/postRepository');

async function getAllPostsUsecase({ page = 1, limit = 10, title = "", status=1  }) {
  return await postRepository.findAll({ page, limit, title, status });
}

module.exports = getAllPostsUsecase;