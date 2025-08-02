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

async function getDaily(req, res) {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Thiếu ngày truy vấn" });

  try {
    const result = await dashboardRepository.getDailyRevenueByDate(date);
    return res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi doanh thu ngày:", err);
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
  getDaily,
};
