const getAllProductCategoriesUsecase = require('../../infrastructure/usecase/category/getAllProductCategoriesUsecase');
const createCategoryUsecase = require('../../infrastructure/usecase/category/createCategoryUsecase');
const updateCategoryUsecase = require('../../infrastructure/usecase/category/updateCategoryUsecase');
const deleteCategoryUsecase = require('../../infrastructure/usecase/category/deleteCategoryUsecase');

async function getAllProductCategoriesHandler(req, res) {
  try {
    const result = await getAllProductCategoriesUsecase();
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi getAllProductCategories:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh mục sản phẩm.' });
  }
}

async function addCategoryHandler(req, res) {
  try {
    const { name, slug, parent_id } = req.body;
    if (!name || !slug) {
      throw new Error('Thiếu thông tin cần thiết để thêm danh mục.');
    }
    const result = await createCategoryUsecase({ name, slug, parent_id });
    res.status(201).json({ message: 'Thêm danh mục thành công.', data: result });
  } catch (error) {
    console.error('[Handler] Lỗi addCategory:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi thêm danh mục sản phẩm.' });
  }
}

async function updateCategoryHandler(req, res) {
  try {
    const category_id = parseInt(req.params.id, 10);
    const { name, slug, parent_id } = req.body;
    if (!name || !slug) {
      throw new Error('Thiếu thông tin cần thiết để cập nhật danh mục.');
    }
    const result = await updateCategoryUsecase({ category_id, name, slug, parent_id });
    res.status(200).json({ message: 'Cập nhật danh mục thành công.', data: result });
  } catch (error) {
    console.error('[Handler] Lỗi updateCategory:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật danh mục sản phẩm.' });
  }
}

async function deleteCategoryHandler(req, res) {
  try {
    const category_id = parseInt(req.params.id, 10);
    if (isNaN(category_id)) {
      return res.status(400).json({ error: 'ID danh mục không hợp lệ.' });
    }
    const result = await deleteCategoryUsecase(category_id);
    res.status(200).json({ message: 'Xóa danh mục thành công.', result });
  } catch (error) {
    console.error('[Handler] Lỗi deleteCategory:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi xóa danh mục sản phẩm.' });
  }
}
module.exports = {
  getAllProductCategoriesHandler,
  addCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
};