const prisma = require('../../shared/prisma');

const dashboardRepository = {
  async getTotalRevenue() {
    const result = await prisma.orders.aggregate({
      _sum: { total_amount: true },
      where: { status: { not: 'canceled' } },
    });
    return result._sum.total_amount || 0;
  },

  async getTotalProducts() {
    return await prisma.products.count();
  },

  async getTotalBrands() {
    return await prisma.brands.count();
  },

  async getTotalCategories() {
    return await prisma.categories.count();
  },

  async getTotalUsers() {
    return await prisma.users.count();
  },

  async getTotalReviews() {
    return await prisma.product_reviews.count();
  },

  async getTotalPosts() {
    return await prisma.posts.count();
  },

  async getTotalPostCategories() {
    return await prisma.categories_post.count();
  },

  async getTotalOrders() {
    return await prisma.orders.count();
  },
};

module.exports = dashboardRepository;
