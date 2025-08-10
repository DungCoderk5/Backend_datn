const slugify = require("slugify");
const postRepository = require("../../repository/postRepository");
async function createCategoryPostUsecase({ name, slug, parent_id }) {
  const finalSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(name, { lower: true, strict: true });

  const existing = await postRepository.findBySlug({ slug: finalSlug });
  if (existing) {
    throw new Error("Slug đã tồn tại. Vui lòng chọn slug khác.");
  }

  const newCategory = await postRepository.createCategory({
    name,
    slug: finalSlug,
    parent_id,
  });

  return newCategory;
}
module.exports = createCategoryPostUsecase;