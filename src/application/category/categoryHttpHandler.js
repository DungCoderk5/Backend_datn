const getAllProductCategoriesUsecase = require('../../infrastructure/usecase/category/getAllProductCategoriesUsecase');

async function getAllProductCategoriesHandler(req, res) {
  try {
    const result = await getAllProductCategoriesUsecase();
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi getAllProductCategories:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh mục sản phẩm.' });
  }
}

module.exports = {
  getAllProductCategoriesHandler,
};