const express = require('express');
const router = express.Router();

const {
  getTotalProductsHandler,
  getTotalBrandsHandler,
  getTotalCategoriesHandler,
  getTotalUsersHandler,
  getTotalReviewsHandler,
  getTotalPostsHandler,
  getTotalPostCategoriesHandler,
  getTotalOrdersHandler,
  getMonthlyRevenueHandler,
  getYearlyRevenueHandler,
  getWeeklyRevenueHandler
} = require('../../../application/dashboar/dashboarHttpHandler');

router.get('/revenue/weekly', getWeeklyRevenueHandler);
//http://localhost:3000/dashboard/revenue/yearly?date=2025-05-31
router.get('/revenue/monthly', getMonthlyRevenueHandler);
router.get('/revenue/yearly', getYearlyRevenueHandler);
router.get('/products', getTotalProductsHandler);
router.get('/brands', getTotalBrandsHandler);
router.get('/categories', getTotalCategoriesHandler);
router.get('/users', getTotalUsersHandler);
router.get('/reviews', getTotalReviewsHandler);
router.get('/posts', getTotalPostsHandler);
router.get('/post-categories', getTotalPostCategoriesHandler);
router.get('/orders', getTotalOrdersHandler);

module.exports = router;
