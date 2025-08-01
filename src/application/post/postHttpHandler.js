const getAllPostsUsecase = require("../../infrastructure/usecase/post/getAllPostsUsecase");
const createPostUsecase = require("../../infrastructure/usecase/post/createPostUsecase");
const deletePostUsecase = require("../../infrastructure/usecase/post/deletePostUsecase");
const updatePostUsecase = require("../../infrastructure/usecase/post/updatePostUsecase");
const getPostByIdUsecase = require("../../infrastructure/usecase/post/getPostByIdUsecase");
const getPostByCategoryUsecase = require("../../infrastructure/usecase/post/getPostByCategoryUsecase");
const getPostCategoryUsecase = require("../../infrastructure/usecase/post/getPostCategoryUsecase");

async function getAllPostsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAllPostsUsecase({ page, limit });
    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getAllPosts:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy danh sách bài viết." });
  }
}

async function getPostCategoryHandler(req, res) {
  try {
    const categories = await getPostCategoryUsecase();
    res.status(200).json({ message: "Lấy danh mục bài viết thành công.", data: categories });
  } catch (error) {
    console.error("[Handler] Lỗi getPostCategory:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy danh mục bài viết." });
    
  }
}

async function getPostByCategoryHandler(req, res) {
  try {
    const category_post_id = parseInt(req.params.categoryId);
    if (!category_post_id) {
      return res.status(400).json({ error: "ID danh mục không hợp lệ." });
    }

    const posts = await getPostByCategoryUsecase({ category_post_id });
    res.status(200).json({ message: "Lấy bài viết theo danh mục thành công.", data: posts });
  } catch (error) {
    console.error("[Handler] Lỗi getPostByCategory:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy bài viết theo danh mục." });
  }
}

async function getPostByIdHandler(req, res) {
  try {
    const post_id = parseInt(req.params.id);
    if (!post_id) {
      return res.status(400).json({ error: "ID bài viết không hợp lệ." });
    }
    const post = await getPostByIdUsecase(post_id);
    if (!post) {
      return res.status(404).json({ error: "Bài viết không tìm thấy." });
    }
    res.status(200).json({ message: "Lấy bài viết thành công.", data: post });
  } catch (error) {
    console.error("[Handler] Lỗi getPostById:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy bài viết." });
    
  }
}

async function deletePostHandler(req, res) {
  try {
    const post_id = parseInt(req.params.id);
    console.log(`[Handler] Xóa bài viết với ID: ${post_id}`);
    
    if (!post_id) {
      return res.status(400).json({ error: "ID bài viết không hợp lệ." });
    }
    const deletedPost = await deletePostUsecase(post_id);

    res.status(200).json({ message: "Xóa bài viết thành công.", data: deletedPost });
  } catch (error) {
    console.error("[Handler] Lỗi deletePost:", error);
    res.status(500).json({error});
  }
}

async function updatePostHandler(req, res) {
  try {
    const post_id = parseInt(req.params.id);
    if (!post_id) {
      return res.status(400).json({ error: "ID bài viết không hợp lệ." });
    }

    const {
      title,
      slug,
      content,
      thumbnail,
      images,
      category_post_id,
      author_id,
      status = 1,
    } = req.body;

    const result = await updatePostUsecase(post_id,{
      title,
      slug,
      content,
      thumbnail,
      images,
      category_post_id,
      author_id,
      status,
    });
    res.status(200).json({ message: "Cập nhật bài viết thành công.", data: result });
  } catch (error) {
    console.error("[Handler] Lỗi updatePost:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật bài viết." });
  }
}

async function addPostHandler(req, res) {
  try {
    const {
      title,
      slug,
      content,
      images,
      category_post_id,
      author_id,
      status = 1, 
    } = req.body;

    if (req.file) {
      thumbnail = req.file.filename;
    }

    const result = await createPostUsecase({
      title,
      slug,
      content,
      thumbnail,
      images,
      category_post_id : Number(category_post_id),
      author_id: Number(author_id),
      status,
    });

    res.status(201).json({ message: "Thêm bài viết thành công", data: result });
  } catch (error) {
    console.error("[Handler] Lỗi addPost:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi thêm bài viết." });
  }
}

module.exports = {
  getAllPostsHandler,
  addPostHandler,
  deletePostHandler,
  updatePostHandler,
  getPostByIdHandler,
  getPostByCategoryHandler,
  getPostCategoryHandler
};
