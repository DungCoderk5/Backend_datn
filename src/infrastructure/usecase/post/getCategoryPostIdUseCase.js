const postRepository = require("../../repository/postRepository");
async function getCategoryPostIdUseCase(category_post_id) {
  if (!category_post_id) {
    throw new Error("Category Id is required");
  }

  const category = await postRepository.findCategoryById(category_post_id); 
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
}


module.exports = getCategoryPostIdUseCase;