const getAllProductCategoriesUsecase = require("../../infrastructure/usecase/category/getAllProductCategoriesUsecase");
const createCategoryUsecase = require("../../infrastructure/usecase/category/createCategoryUsecase");
const updateCategoryUsecase = require("../../infrastructure/usecase/category/updateCategoryUsecase");
const deleteCategoryUsecase = require("../../infrastructure/usecase/category/deleteCategoryUsecase");
const getCategoryByIdUsecase = require("../../infrastructure/usecase/category/getCategoryByIdUsecase");
const categoryRepository = require("../../infrastructure/repository/categoryRepository");
const productRepository = require("../../infrastructure/repository/productRepository");
const slugify = require("slugify");
async function getAllProductCategoriesHandler(req, res) {
  try {
    const { id, name, status, page, limit, keyword, sortBy, sortOrder } =
      req.query;

    const result = await getAllProductCategoriesUsecase({
      id,
      name,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 5,
      keyword,
      sortBy: sortBy || "name",
      sortOrder: sortOrder || "asc",
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getAllProductCategories:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy danh mục sản phẩm." });
  }
}

async function addCategoryHandler(req, res) {
  try {
    const { name, parent_id, status } = req.body;
    const image = req.file?.filename || null;

    if (!name) {
      return res.status(400).json({ message: "Thiếu tên danh mục." });
    }

    // Tạo slug tự động từ name
    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    const parsedParentId =
      parent_id !== undefined && parent_id !== null && parent_id !== ""
        ? Number(parent_id)
        : null;

    // Giữ nguyên 0 nếu người dùng truyền 0
    const parsedStatus =
      status !== undefined && status !== null && status !== ""
        ? Number(status)
        : 1;

    const result = await createCategoryUsecase({
      name,
      slug,
      parent_id: parsedParentId,
      image,
      status: parsedStatus,
    });

    return res.status(201).json({
      message: "Thêm danh mục thành công.",
      data: result,
    });
  } catch (error) {
    console.error("[Handler] Lỗi addCategory:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ khi thêm danh mục sản phẩm.",
      error: error.message,
    });
  }
}


async function updateCategoryHandler(req, res) {
  try {
    const categories_id = Number(req.params.id);
    if (!categories_id) {
      return res.status(400).json({ error: "ID danh mục không hợp lệ" });
    }

    const { name, status, parent_id } = req.body;
    let image;

    if (req.file) {
      // Có upload ảnh mới
      image = req.file.filename;
    } else {
      // Lấy ảnh cũ từ DB
      const oldCategory = await categoryRepository.findById(categories_id);
      image = oldCategory?.image || null;
    }

    if (!name) {
      throw new Error("Thiếu tên danh mục để cập nhật.");
    }

    const slug = slugify(name, { lower: true, strict: true, locale: "vi" });

    const result = await updateCategoryUsecase({
      categories_id,
      name,
      slug,
      parent_id: parent_id ? Number(parent_id) : null,
      image,
      status: status !== undefined ? Number(status) : 1,
    });

    res.status(200).json({
      message: "Cập nhật danh mục thành công.",
      data: result,
    });
  } catch (error) {
    console.error("[Handler] Lỗi updateCategory:", error);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ khi cập nhật danh mục sản phẩm." });
  }
}
async function getCategoryByIdHandler(req, res) {
  try {
    const categories_id = parseInt(req.params.id, 10);
    if (isNaN(categories_id)) {
      return res.status(400).json({ error: "ID danh mục không hợp lệ." });
    }

    const category = await getCategoryByIdUsecase({ categories_id });
    if (!category) {
      return res.status(404).json({ error: "Không tìm thấy danh mục." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("[Handler] Lỗi getCategoryById:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy danh mục." });
  }
}
async function deleteCategoryHandler(req, res) {
  try {
    const category_id = parseInt(req.params.id, 10);
    if (isNaN(category_id)) {
      return res.status(400).json({ error: "ID danh mục không hợp lệ." });
    }
    const result = await deleteCategoryUsecase(category_id);
    res.status(200).json({ message: "Xóa danh mục thành công.", result });
  } catch (error) {
    console.error("[Handler] Lỗi deleteCategory:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi xóa danh mục sản phẩm." });
  }
}
module.exports = {
  getAllProductCategoriesHandler,
  addCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  getCategoryByIdHandler,
};
