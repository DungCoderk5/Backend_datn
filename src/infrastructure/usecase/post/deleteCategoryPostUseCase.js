const postRepository = require("../../repository/postRepository");
async function deleteCategoryPostUsecase(categoryId) {
  const category = await postRepository.findById(categoryId);
  
  if (!category) {
    throw new Error("Danh mục không tồn tại.");
  }

  const postsInCategory = await postRepository.findByCate(categoryId);
  if (postsInCategory.length > 0) {
    throw new Error("Không thể xóa danh mục vì nó chứa bài viết.");
  }

  return await postRepository.deleteCategory(categoryId);
}
module.exports = deleteCategoryPostUsecase;
