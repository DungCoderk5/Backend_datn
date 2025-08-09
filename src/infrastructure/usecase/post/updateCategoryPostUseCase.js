const postRepository = require("../../repository/postRepository");
const slugify = require("slugify");

async function updateCategoryUsecase(category_post_id, data) {
  // Kiểm tra danh mục có tồn tại không
  const existingCategory = await postRepository.findByCate(category_post_id);

  if (!existingCategory) {
    throw new Error("Danh mục không tồn tại.");
  }

  // Nếu có trường 'name' thì tạo slug tự động
  if (data.name) {
    data.slug = slugify(data.name, {
      lower: true,
      strict: true, // bỏ ký tự đặc biệt
      locale: "vi",
    });
  }

  // Thực hiện cập nhật
  const updatedCategory = await postRepository.updateCategory(category_post_id, data);

  return updatedCategory;
}

module.exports = updateCategoryUsecase;
