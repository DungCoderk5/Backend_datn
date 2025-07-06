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
} = require('../../../application/product/productHttpHandler');


router.get('/', getAllProductsHandler);
router.get('/detail/:id', getProductDetailHandler);
router.get('/detail/slug', getProductDetailHandler);
router.get('/best-selling', getBestSellingHandler);
router.get('/newest', getNewestProductsHandler);
router.get('/featured', getFeaturedProductsHandler);
router.get('/category', getProductsByCategoryHandler);
router.get('/deals', getDealProductsHandler);
router.get('/related', getRelatedProductsHandler);
router.get('/gender', getProductsByGenderHandler);
router.post('/add-product', addProductHandler);

module.exports = router;
