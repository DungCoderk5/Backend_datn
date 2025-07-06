const express = require('express');
const router = express.Router();

const {
  getTotalRevenueHandler,
  getTotalProductsHandler,
  getTotalBrandsHandler,
  getTotalCategoriesHandler,
  getTotalUsersHandler,
  getTotalReviewsHandler,
  getTotalPostsHandler,
  getTotalPostCategoriesHandler,
  getTotalOrdersHandler,
} = require('../../../application/dashboar/dashboarHttpHandler');

router.get('/revenue', getTotalRevenueHandler);
router.get('/products', getTotalProductsHandler);
router.get('/brands', getTotalBrandsHandler);
router.get('/categories', getTotalCategoriesHandler);
router.get('/users', getTotalUsersHandler);
router.get('/reviews', getTotalReviewsHandler);
router.get('/posts', getTotalPostsHandler);
router.get('/post-categories', getTotalPostCategoriesHandler);
router.get('/orders', getTotalOrdersHandler);

module.exports = router;
