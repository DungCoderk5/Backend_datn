const postRepository = require('../../repository/postRepository');

async function getFeaturedPostUsecase() {
  return await postRepository.findFeaturedPost();
}

module.exports = getFeaturedPostUsecase;
