const postRepository = require('../../repository/postRepository');

async function getAllPostsUsecase({ page = 1, limit = 10,id, title = "", status=1,sortBy = "created_at", sortOrder = "desc"  }) {
  return await postRepository.findAll({ page, limit, id,title, status,sortBy, sortOrder });
}

module.exports = getAllPostsUsecase;