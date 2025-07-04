const getAllProductsUsecase = require('../../infrastructure/usecase/product/getAllProductUsecase');
const getProductDetailUsecase = require('../../infrastructure/usecase/product/getProductDetailUsecase');
const getBestSellingUsecase = require('../../infrastructure/usecase/product/getBestSellingUsecase');
const getNewestProductsUsecase = require('../../infrastructure/usecase/product/getNewestProductsUsecase');
const getFeaturedProductsUsecase = require('../../infrastructure/usecase/product/getFeaturedProductsUsecase');
const getProductsByCategoryUsecase = require('../../infrastructure/usecase/product/getProductsByCategoryUsecase');
const getDealProductsUsecase = require('../../infrastructure/usecase/product/getDealProductsUsecase');
const getRelatedProductsUsecase = require('../../infrastructure/usecase/product/getRelatedProductsUsecase');
const getProductsByGenderUsecase = require('../../infrastructure/usecase/product/getProductsByGenderUsecase');




async function getAllProductsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getAllProductsUsecase({ page, limit });

    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi getAllProducts:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh sách sản phẩm.' });
  }
}

async function getProductDetailHandler(req, res) {
  try {
    const { id,slug } = req.params;

    const identifier = {};
    if (id) identifier.id = Number(id);
    if (slug) identifier.slug = slug;

    const product = await getProductDetailUsecase(identifier);
    res.status(200).json(product);
  } catch (error) {
    console.error('[Handler] Lỗi getProductDetail:', error.message);
    res.status(404).json({ error: error.message });
  }
}


async function getBestSellingHandler(req, res) {
  try {
    const top = parseInt(req.query.top) || 3;
    console.log('Top best selling products:', top);
    const result = await getBestSellingUsecase(top);
    console.log('Best Selling Products:', result);
    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi lấy sản phẩm bán chạy:', err);
    res.status(500).json({ error: 'Server Error' });
  }
}

async function getNewestProductsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getNewestProductsUsecase({ page, limit });

    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi lấy sản phẩm mới nhất:', err);
    res.status(500).json({ error: 'Server Error' });
  }
}

async function getFeaturedProductsHandler(req, res) {
  try {
    const result = await getFeaturedProductsUsecase();
    res.status(200).json({products:result});
  } catch (err) {
    console.error('Lỗi khi lấy sản phẩm nổi bật:', err);
    res.status(500).json({ error: 'Server Error' });
  }
}
async function getProductsByCategoryHandler(req, res) {
  try {
    const categoryName = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!categoryName) {
      return res.status(400).json({ error: 'Missing category name or slug' });
    }

    const result = await getProductsByCategoryUsecase({ categoryName, page, limit });

    res.json({
      products: result.products,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getDealProductsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getDealProductsUsecase({ page, limit });

    res.json({
      products: result.products,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Lỗi lấy sản phẩm đang giảm giá:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getRelatedProductsHandler(req, res) {
  try {
    const categoryId = parseInt(req.query.categoryId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'categoryId phải là số nguyên' });
    }

    const result = await getRelatedProductsUsecase({ categoryId, page, limit });

    res.json({
      products: result.products,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Lỗi lấy sản phẩm liên quan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getProductsByGenderHandler(req, res) {
  try {
    const genderName = req.query.gender;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!genderName) {
      return res.status(400).json({ error: 'Missing gender query' });
    }

    const result = await getProductsByGenderUsecase({ genderName, page, limit });

    res.json({
      products: result.products,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo giới tính:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports = {
  getAllProductsHandler,
  getProductDetailHandler,
  getBestSellingHandler,
  getNewestProductsHandler,
  getFeaturedProductsHandler,
  getProductsByCategoryHandler,
  getDealProductsHandler,
  getRelatedProductsHandler,
  getProductsByGenderHandler,
  
};
