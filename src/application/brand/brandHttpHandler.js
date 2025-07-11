const getAllProductBrandUsecase = require('../../infrastructure/usecase/brand/getAllProductBrandUsecase');

async function getAllProductBrandHandler(req, res) {
  try {
    const result = await getAllProductBrandUsecase();
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi getAllProductBrand:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy thương hiệu sản phẩm.' });
  }
}

module.exports = {
    getAllProductBrandHandler,
};