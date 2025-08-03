const dashboardRepository = require("../../infrastructure/repository/dashboardRepository");

// async function getTotalRevenueHandler(req, res) {
//   try {
//     const result = await dashboardRepository.getTotalRevenue();
//     res.status(200).json({ totalRevenue: result });
//   } catch (err) {
//     res.status(500).json({ error: 'Lỗi lấy tổng doanh thu' });
//   }
// }

async function getMonthlyRevenueHandler(req, res) {
  const { date } = req.query;

  if (!date) return res.status(400).json({ error: "Thiếu ngày truy vấn" });

  try {
    const result = await dashboardRepository.getMonthlyRevenueByDate(date);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi doanh thu tháng:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
}

async function getWeeklyRevenueHandler(req, res) {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Thiếu ngày truy vấn" });
  }

  try {
    const result = await dashboardRepository.getWeeklyRevenueByDate(date);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi doanh thu tuần:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
}

async function getYearlyRevenueHandler(req, res) {
  const { date } = req.query;

  if (!date) return res.status(400).json({ error: "Thiếu ngày truy vấn" });

  try {
    const result = await dashboardRepository.getYearlyRevenueByDate(date);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi doanh thu năm:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
}

async function getTotalRevvenueByDayHandler(req, res) {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Thiếu ngày truy vấn" });
  try {
    const result = await dashboardRepository.getTotalRevenueByDay(date);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi doanh thu theo ngày:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
async function getTotalRevenueByWeekHandler(req, res) {
  const { week } = req.query;
  if (!week) return res.status(400).json({ error: "Thiếu tuần truy vấn" });
  try {
    const result = await dashboardRepository.getTotalRevenueByWeek(week);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi doanh thu theo tuần:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
}
async function getTotalRevenueByMonthHandler(req, res) {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: "Thiếu tháng truy vấn" });
  try {
    const result = await dashboardRepository.getTotalRevenueByMonth(month);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi doanh thu theo tháng:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
async function getTotalRevenueByYearHandler(req, res) {
  const { year } = req.query;
  if (!year) return res.status(400).json({ error: "Thiếu năm truy vấn" });
  try {
    const result = await dashboardRepository.getTotalRevenueByYear(year);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi doanh thu theo năm:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
  
}
async function getTotalProductsHandler(req, res) {
  try {
    const result = await dashboardRepository.getTotalProducts();
    res.status(200).json({ totalProducts: result });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy tổng sản phẩm" });
  }
}

async function getTotalBrandsHandler(req, res) {
  try {
    const result = await dashboardRepository.getTotalBrands();
    res.status(200).json({ totalBrands: result });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy số thương hiệu" });
  }
}

async function getTotalCategoriesHandler(req, res) {
  try {
    const result = await dashboardRepository.getTotalCategories();
    res.status(200).json({ totalCategories: result });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy tổng danh mục" });
  }
}

async function getTotalUsersHandler(req, res) {
  try {
    const result = await dashboardRepository.getTotalUsers();
    res.status(200).json({ totalUsers: result });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy tổng người dùng" });
  }
}

async function getTotalReviewsHandler(req, res) {
  try {
    const result = await dashboardRepository.getTotalReviews();
    res.status(200).json({ totalReviews: result });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy tổng đánh giá" });
  }
}

async function getTotalPostsHandler(req, res) {
  try {
    const result = await dashboardRepository.getTotalPosts();
    res.status(200).json({ totalPosts: result });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy tổng bài viết" });
  }
}

async function getTotalPostCategoriesHandler(req, res) {
  try {
    const result = await dashboardRepository.getTotalPostCategories();
    res.status(200).json({ totalPostCategories: result });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy tổng danh mục bài viết" });
  }
}

async function getTotalOrdersHandler(req, res) {
  try {
    const result = await dashboardRepository.getTotalOrders();
    res.status(200).json({ totalOrders: result });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy tổng đơn hàng" });
  }
}
async function getLowStockProductsHandler(req, res) {
  try {
    const result = await dashboardRepository.getLowStockProducts();
    res.status(200).json({ data: result });
  } catch (err) {
    console.error("[Handler] Lỗi lấy sản phẩm tồn kho thấp:", err);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ khi lấy sản phẩm tồn kho thấp." });
  }
}
async function getBestSellingProductHandler(req, res) {
  try {
    const bestSellingProducts =
      await dashboardRepository.getBestSellingProduct();
    res.status(200).json(bestSellingProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi truy vấn dữ liệu" });
  }
}
async function getPendingOrdersHandler(req, res) {
  try {
    const orders = await dashboardRepository.getPendingOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
async function getRecentOrdersHandler(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await dashboardRepository.getRecentOrders(limit);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
module.exports = {
  getTotalProductsHandler,
  getTotalBrandsHandler,
  getTotalCategoriesHandler,
  getTotalUsersHandler,
  getTotalReviewsHandler,
  getTotalPostsHandler,
  getTotalPostCategoriesHandler,
  getTotalOrdersHandler,
  getYearlyRevenueHandler,
  getMonthlyRevenueHandler,
  getWeeklyRevenueHandler,
  getLowStockProductsHandler,
  getBestSellingProductHandler,
  getPendingOrdersHandler,
  getRecentOrdersHandler,
  getTotalRevvenueByDayHandler,
  getTotalRevenueByMonthHandler,
  getTotalRevenueByYearHandler,
  getTotalRevenueByWeekHandler
};
