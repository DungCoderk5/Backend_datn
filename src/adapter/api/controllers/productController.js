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
} = require('../../../application/product/productHttpHandler');


router.get('/products/best-selling', getBestSellingHandler);
router.get('/products/newest', getNewestProductsHandler);
router.get('/products/featured', getFeaturedProductsHandler);
router.get('/products/category', getProductsByCategoryHandler);
router.get('/products/deals', getDealProductsHandler);
router.get('/products/related', getRelatedProductsHandler);
router.get('/products/gender', getProductsByGenderHandler);
router.get('/products/slug/:slug', getProductDetailHandler);

router.get('/products', getAllProductsHandler);

// 👉 Route động để cuối cùng
router.get('/products/:id', getProductDetailHandler);



module.exports = router;
