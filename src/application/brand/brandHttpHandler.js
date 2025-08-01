const getAllProductBrandUsecase = require('../../infrastructure/usecase/brand/getAllProductBrandUsecase');
const createBrandUsecase = require('../../infrastructure/usecase/brand/createBrandUsecase');
const updateBrandUsecase = require('../../infrastructure/usecase/brand/updateBrandUsecase');
const deleteBrandUsecase = require('../../infrastructure/usecase/brand/deleteBrandUsecase');

async function getAllProductBrandHandler(req, res) {
  try {
    const result = await getAllProductBrandUsecase();
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi getAllProductBrand:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy thương hiệu sản phẩm.' });
  }
}

async function deleteBrandHandler(req, res) {
  try {
    const brand_id = parseInt(req.params.id, 10);
    if (isNaN(brand_id)) {
      return res.status(400).json({ error: 'ID thương hiệu không hợp lệ.' });
    }
    const result = await deleteBrandUsecase(brand_id);
    res.status(200).json({ message: 'Xóa thương hiệu thành công.', result });
  } catch (error) {
    console.error('[Handler] Lỗi deleteBrand:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi xóa thương hiệu sản phẩm.' });
  }
}

async function updateBrandHandler(req, res) {
  try {
    const brand_id = parseInt(req.params.id, 10);
    const { name, slug, logo_url } = req.body;
    if (!name || !slug) {
      throw new Error('Thiếu thông tin cần thiết để thêm thương hiệu.');
    }
    const result = await updateBrandUsecase({brand_id, name, slug, logo_url });
    res.status(200).json({ message: 'Cập nhật thương hiệu thành công.', data: result });
  } catch (error) {
    console.error('[Handler] Lỗi updateBrand:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật thương hiệu sản phẩm.' });
  }
}

async function addBrandHandler(req, r) {
  try {
    const { name, slug, logo_url } = req.body;
    if (!name || !slug) {
      throw new Error('Thiếu thông tin cần thiết để thêm thương hiệu.');
    }
    const result = await createBrandUsecase({ name, slug, logo_url });
    res.status(201).json({ message: 'Thêm thương hiệu thành công.', data: result });
  } catch (error) {
    console.error('[Handler] Lỗi addBrand:', error);
    throw new Error('Lỗi máy chủ khi thêm thương hiệu sản phẩm.');
  }
}

module.exports = {
    getAllProductBrandHandler,
    addBrandHandler,
    updateBrandHandler,
    deleteBrandHandler
};