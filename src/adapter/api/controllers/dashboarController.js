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
  getWeeklyRevenueHandler,
  getLowStockProductsHandler,
  getBestSellingProductHandler,
  getPendingOrdersHandler,
  getRecentOrdersHandler,
  getTotalRevvenueByDayHandler,
  getTotalRevenueByMonthHandler,
  getTotalRevenueByYearHandler,
  getTotalRevenueByWeekHandler
} = require('../../../application/dashboar/dashboarHttpHandler');

router.get('/revenue/weekly', getWeeklyRevenueHandler);
//http://localhost:3000/dashboard/revenue/yearly?date=2025-05-31
router.get('/revenue/monthly', getMonthlyRevenueHandler);
router.get('/revenue/yearly', getYearlyRevenueHandler);
router.get('/revenue/totalbyday', getTotalRevvenueByDayHandler);
router.get('/revenue/totalbyweek', getTotalRevenueByWeekHandler);
router.get('/revenue/totalbymonth', getTotalRevenueByMonthHandler);
router.get('/revenue/totalbyyear', getTotalRevenueByYearHandler);
router.get('/products', getTotalProductsHandler);
router.get('/brands', getTotalBrandsHandler);
router.get('/categories', getTotalCategoriesHandler);
router.get('/users', getTotalUsersHandler);
router.get('/reviews', getTotalReviewsHandler);
router.get('/posts', getTotalPostsHandler);
router.get('/post-categories', getTotalPostCategoriesHandler);
router.get('/orders', getTotalOrdersHandler);
router.get('/stock', getLowStockProductsHandler);
router.get('/stock', getLowStockProductsHandler);
router.get('/best-selling-products', getBestSellingProductHandler);
router.get('/pending-orders', getPendingOrdersHandler);
router.get('/recent-orders', getRecentOrdersHandler);

module.exports = router;
