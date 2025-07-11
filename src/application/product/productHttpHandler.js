const getAllProductsUsecase = require('../../infrastructure/usecase/product/getAllProductUsecase');
const getProductDetailUsecase = require('../../infrastructure/usecase/product/getProductDetailUsecase');
const getBestSellingUsecase = require('../../infrastructure/usecase/product/getBestSellingUsecase');
const getNewestProductsUsecase = require('../../infrastructure/usecase/product/getNewestProductsUsecase');
const getFeaturedProductsUsecase = require('../../infrastructure/usecase/product/getFeaturedProductsUsecase');
const getProductsByCategoryUsecase = require('../../infrastructure/usecase/product/getProductsByCategoryUsecase');
const getDealProductsUsecase = require('../../infrastructure/usecase/product/getDealProductsUsecase');
const getRelatedProductsUsecase = require('../../infrastructure/usecase/product/getRelatedProductsUsecase');
const getProductsByGenderUsecase = require('../../infrastructure/usecase/product/getProductsByGenderUsecase');
const addProductUsecase = require('../../infrastructure/usecase/product/addProductUsecase');
const addToCartUsecase = require('../../infrastructure/usecase/product/addToCartUsecase');
const searchProductsUsecase = require('../../infrastructure/usecase/product/searchProductsUsecase');
const getAllCouponsUsecase = require('../../infrastructure/usecase/product/getAllCouponsUsecase');
const addToWishlistUsecase = require('../../infrastructure/usecase/product/addToWishlistUsecase');
const getReviewsByProductUsecase = require('../../infrastructure/usecase/product/getReviewsByProductUsecase');
const createProductReviewUsecase = require('../../infrastructure/usecase/product/createProductReviewUsecase');


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
    const { id } = req.params;
    const { slug } = req.query;

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
    res.status(200).json(result);
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
    const productId = parseInt(req.params.productId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const result = await getRelatedProductsUsecase({ productId, page, limit });

    res.status(200).json(result);
  } catch (err) {
    console.error('[Handler] Lỗi getRelatedProducts:', err);
    res.status(500).json({ error: 'Lỗi khi lấy sản phẩm cùng loại.' });
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

async function addProductHandler(req, res) {
  try {
    const data = req.body;
    const create = await addProductUsecase(data);
    res.status(200).json({message: 'tạo sản phẩm thành công', product: create})
  } catch (error) {
    console.error('Lỗi khi lấy thêm sản phẩm:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function addToCart(req, res) {
  try {
      const data = req.body;
      const cart = await addToCartUsecase(data);
      res.status(200).json({message: 'thêm sản phẩm vào giỏ hàng thành công', cart: cart})
  } catch (error) {
    console.error('Lỗi khi lấy thêm sản phẩm:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function searchProductsHandler(req, res) {
  try {
    const keyword = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await searchProductsUsecase({ keyword, page, limit });
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi searchProducts:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi tìm kiếm sản phẩm.' });
  }
}

async function getAllCouponsHandler(req, res) {
  try {
    const result = await getAllCouponsUsecase();
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi getAllCoupons:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh sách mã giảm giá.' });
  }
}

async function addToWishlistHandler(req, res) {
  try {
    const { user_id, product_id } = req.body;

    const result = await addToWishlistUsecase({ user_id, product_id });
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi addToWishlist:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi thêm sản phẩm vào danh sách yêu thích.' });
  }
}

async function getReviewsByProductHandler(req, res) {
  try {
    const productId = parseInt(req.params.productId);
    const result = await getReviewsByProductUsecase({ productId });
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi getReviewsByProduct:', error);
    res.status(500).json({ error: 'Lỗi khi lấy đánh giá theo sản phẩm.' });
  }
}

async function createProductReviewHandler(req, res) {
  try {
    const product_id = parseInt(req.params.productId);
    const { user_id, rating, content } = req.body;

    if (!user_id || !rating || !product_id) {
      return res.status(400).json({ error: 'Thiếu thông tin đánh giá.' });
    }

    const review = await createProductReviewUsecase({ user_id, product_id, rating, content });
    res.status(201).json(review);
  } catch (err) {
    console.error('[Handler] Lỗi createProductReview:', err);

    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Bạn đã đánh giá sản phẩm này rồi.' });
    }

    res.status(500).json({ error: 'Lỗi khi gửi đánh giá.' });
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
  addProductHandler,
  addToCart,
  searchProductsHandler,
  getAllCouponsHandler,
  addToWishlistHandler,
  getReviewsByProductHandler,
  createProductReviewHandler
};
