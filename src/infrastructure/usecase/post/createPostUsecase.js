const slugify = require("slugify");
const postRepository = require("../../repository/postRepository");

async function createPostUsecase({
  title,
  slug,
  content,
  thumbnail,
  images,
  category_post_id,
  author_id,
  status = 1,
}) {
  const finalSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });

  const existing = await postRepository.findBySlug({slug: finalSlug});
  if (existing) {
    throw new Error("Slug đã tồn tại. Vui lòng chọn slug khác.");
  }

  const newPost = await postRepository.create({
    title,
    slug: finalSlug,
    content,
    thumbnail,
    images,
    category_post_id,
    author_id,
    status,
  });

  return newPost;
}

module.exports = createPostUsecase;
