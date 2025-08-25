const postRepository = require('../../repository/postRepository');

async function getFeaturedPostUsecase({ page = 1, limit = 10 }) {
  return await postRepository.findFeaturedPost(page, limit);
}

module.exports = getFeaturedPostUsecase;
