const express = require('express');
const router = express.Router();

const {
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
  searchProductsHandler,
  getAllCouponsHandler,
  addToWishlistHandler,
  getReviewsByProductHandler,
  createProductReviewHandler,
  getProductsByBrandHandler
} = require('../../../application/product/productHttpHandler');


router.get('/', getAllProductsHandler);
router.get('/brand/:brandId', getProductsByBrandHandler);
router.get('/detail/:id', getProductDetailHandler);
router.get('/detail/slug', getProductDetailHandler);
router.get('/best-selling', getBestSellingHandler);
router.get('/newest', getNewestProductsHandler);
router.get('/featured', getFeaturedProductsHandler);
router.get('/category', getProductsByCategoryHandler);
router.get('/deals', getDealProductsHandler);
router.get('/related/:productId', getRelatedProductsHandler);
router.get('/gender', getProductsByGenderHandler);
router.post('/add-product', addProductHandler);
router.get('/search', searchProductsHandler);
router.get('/coupons', getAllCouponsHandler);
router.post('/wishlist', addToWishlistHandler);
router.get('/reviews/:productId', getReviewsByProductHandler);
router.post('/reviews/:productId', createProductReviewHandler);

module.exports = router;
