const getAllPostsUsecase = require("../../infrastructure/usecase/post/getAllPostsUsecase");
const createPostUsecase = require("../../infrastructure/usecase/post/createPostUsecase");
const deletePostUsecase = require("../../infrastructure/usecase/post/deletePostUsecase");
const updatePostUsecase = require("../../infrastructure/usecase/post/updatePostUsecase");
const getPostByIdUsecase = require("../../infrastructure/usecase/post/getPostByIdUsecase");
const getPostBySlugUsecase = require("../../infrastructure/usecase/post/getPostBySlugUsecase");
const getPostByCategoryUsecase = require("../../infrastructure/usecase/post/getPostByCategoryUsecase");
const getPostCategoryUsecase = require("../../infrastructure/usecase/post/getPostCategoryUsecase");
const createCategoryPostUsecase = require("../../infrastructure/usecase/post/createCategoryPostUsecase");
const deleteCategoryPostUsecase = require("../../infrastructure/usecase/post/deleteCategoryPostUseCase");
const updateCategoryUsecase = require("../../infrastructure/usecase/post/updateCategoryPostUseCase");
const getCategoryPostIdUseCase = require("../../infrastructure/usecase/post/getCategoryPostIdUseCase");
const updateViewPostUsecase = require("../../infrastructure/usecase/post/updateViewPostUseCase");
const getFeaturedPostUsecase = require("../../infrastructure/usecase/post/getFeaturedPostUsecase");

async function getAllPostsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const title = req.query.title || "";
    const status =
      req.query.status !== undefined ? Number(req.query.status) : undefined;
      const id = req.query.id;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
    const result = await getAllPostsUsecase({
      page,
      limit,
      id,
      title,
      status,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getAllPosts:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy danh sách bài viết." });
  }
}

async function getPostCategoryHandler(req, res) {
  try {
    const { page, limit, id, name, slug, sortBy, sortOrder } = req.query;

    const result = await getPostCategoryUsecase({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      id: id ? parseInt(id) : undefined,
      name,
      slug,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      message: "Lấy danh mục bài viết thành công.",
      ...result, // { data, total, currentPage, totalPages }
    });
  } catch (error) {
    console.error("[Handler] Lỗi getPostCategory:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy danh mục bài viết." });
  }
}

async function getPostByCategoryHandler(req, res) {
  try {
    const category_post_id = parseInt(req.params.categoryId);
    if (!category_post_id || isNaN(category_post_id)) {
      return res.status(400).json({ error: "ID danh mục không hợp lệ." });
    }

    const posts = await getPostByCategoryUsecase(category_post_id);
    res.status(200).json({
      message: "Lấy bài viết theo danh mục thành công.",
      data: posts,
    });
  } catch (error) {
    console.error("[Handler] Lỗi getPostByCategory:", error.message);
    res.status(500).json({
      error: error.message || "Lỗi máy chủ khi lấy bài viết theo danh mục.",
    });
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
async function getPostBySlugHandler(req, res) {
  try {
    const slug = req.params.slug;
    if (!slug) {
      return res.status(400).json({ error: "Slug bài viết không hợp lệ." });
    }
    const post = await getPostBySlugUsecase(slug);
    if (!post) {
      return res.status(404).json({ error: "Bài viết không tìm thấy." });
    }
    res.status(200).json({ message: "Lấy bài viết thành công.", data: post });
  } catch (error) {
    console.error("[Handler] Lỗi getPostBySlug:", error);
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

    res
      .status(200)
      .json({ message: "Xóa bài viết thành công.", data: deletedPost });
  } catch (error) {
    console.error("[Handler] Lỗi deletePost:", error);
    res.status(500).json({ error });
  }
}

async function updatePostHandler(req, res) {
  try {
    const post_id = parseInt(req.params.id);
    if (!post_id) {
      return res.status(400).json({ error: "ID bài viết không hợp lệ." });
    }

    const oldPost = await getPostByIdUsecase(post_id);
    if (!oldPost) {
      return res.status(404).json({ error: "Bài viết không tồn tại." });
    }

    const {
      title,
      slug,
      content,
      images,
      category_post_id,
      author_id,
      status,
    } = req.body;

    const thumbnail = req.file ? req.file.filename : oldPost.thumbnail;

    const newCategoryPostId = category_post_id !== undefined && category_post_id !== null ? Number(category_post_id) : oldPost.category_post_id;
    const newAuthorId = author_id !== undefined && author_id !== null ? Number(author_id) : oldPost.author_id;
    const newStatus = status !== undefined && status !== null ? Number(status) : oldPost.status;

    const result = await updatePostUsecase(post_id, {
      title: title !== undefined ? title : oldPost.title,
      slug: slug !== undefined ? slug : oldPost.slug,
      content: content !== undefined ? content : oldPost.content,
      thumbnail,
      images: images !== undefined ? images : oldPost.images,
      category_post_id: newCategoryPostId,
      author_id: newAuthorId,
      status: newStatus,
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
      category_post_id: Number(category_post_id),
      author_id: Number(author_id),
      status: Number(status),
    });

    res.status(201).json({ message: "Thêm bài viết thành công", data: result });
  } catch (error) {
    console.error("[Handler] Lỗi addPost:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi thêm bài viết." });
  }
}
async function upLoadHandler(req, res) {
  try {
    const file = req.file;



    const fileName = file.filename;
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const imageUrl = `${baseUrl}/uploads/blog/${fileName}`;

    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error("[Handler] Lỗi upLoad:", error);
    return res.status(500).json({ error: "Đã xảy ra lỗi khi tải ảnh." });
  }
}
async function createCategoryPostHandler(req,res) {
  try {
    const { name, slug, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tên danh mục không được để trống." });
    }

    const newCategory = await createCategoryPostUsecase({ name, slug, parent_id });

    res.status(201).json({
      message: "Tạo danh mục bài viết thành công.",
      data: newCategory,
    });
  } catch (error) {
    console.error("[Handler] Lỗi createCategoryPost:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi tạo danh mục bài viết." });
  }
  
}
async function deleteCategoryPostHandler(req, res) {
  try {
    const categoryId = parseInt(req.params.id);
    if (!categoryId) {
      return res.status(400).json({ error: "ID danh mục không hợp lệ." });
    }

    const result = await deleteCategoryPostUsecase(categoryId);
    res.status(200).json({ message: "Xóa danh mục thành công.", data: result });
  } catch (error) {
    console.error("[Handler] Lỗi deleteCategoryPost:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi xóa danh mục." });
  }
}
async function updateCategoryHandler(req, res) {
  try {
    const category_post_id = parseInt(req.params.id);
    if (!category_post_id || isNaN(category_post_id)) {
      return res.status(400).json({ error: "ID danh mục không hợp lệ." });
    }

    const data = req.body;
    const updatedCategory = await updateCategoryUsecase(category_post_id, data);

    res.status(200).json({
      message: "Cập nhật danh mục thành công.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("[Handler] Lỗi updateCategory:", error.message);
    res.status(500).json({
      error: error.message || "Lỗi máy chủ khi cập nhật danh mục.",
    });
  };
}
async function getCategoryPostIdHandler(req, res) {
  try {
    const category_post_id = Number(req.params.id);

    const category = await getCategoryPostIdUseCase(category_post_id);

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
async function updateViewPostHandler(req, res) {
  try {
    const { post_id } = req.params; 
    if (!post_id) {
      return res.status(400).json({ error: "post_id is required" });
    }

    const updatedPost = await updateViewPostUsecase(post_id);

    res.status(200).json({
      message: "Cập nhật lượt xem thành công",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getFeaturedPost(req, res) {
  try {
    const categories = await getFeaturedPostUsecase();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error getFeaturedCategories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
module.exports = {
  getAllPostsHandler,
  addPostHandler,
  deletePostHandler,
  updatePostHandler,
  getPostByIdHandler,
  getPostByCategoryHandler,
  getPostCategoryHandler,
  upLoadHandler,
  getPostBySlugHandler,
  createCategoryPostHandler,
  deleteCategoryPostHandler,
  updateCategoryHandler,
  getCategoryPostIdHandler,
  updateViewPostHandler,
  getFeaturedPost
};
