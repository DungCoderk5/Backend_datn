const postRepository = require('../../repository/postRepository');

async function getAllPostsUsecase({ page = 1, limit = 10, title = "", status=1,sortBy = "created_at", sortOrder = "desc"  }) {
  return await postRepository.findAll({ page, limit, title, status,sortBy, sortOrder });
}

module.exports = getAllPostsUsecase;