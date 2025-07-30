const prisma = require('../../shared/prisma');
const { startOfWeek, addDays, format, isAfter, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachMonthOfInterval } = require('date-fns');

const dashboardRepository = {
 async getWeeklyRevenueByDate(inputDateStr) {
    const inputDate = new Date(inputDateStr);

    const startDate = startOfWeek(inputDate, { weekStartsOn: 1 });
    const today = new Date();

    const result = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i);

      if (currentDate > inputDate) break;

      const start = new Date(currentDate.setHours(0, 0, 0, 0));
      const end = new Date(currentDate.setHours(23, 59, 59, 999));

      const revenue = await prisma.orders.aggregate({
        _sum: { total_amount: true },
        where: {
          status: { not: 'canceled' },
          created_at: {
            gte: start,
            lte: end,
          },
        },
      });

      result.push({
        day: format(start, 'EEEE (dd/MM)'),
        revenue: revenue._sum.total_amount || 0,
      });
    }

    return result;
  },

  async getMonthlyRevenueByDate(dateStr) {
    const date = new Date(dateStr);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const days = eachDayOfInterval({ start, end });

    const results = await Promise.all(
      days.map(async (day) => {
        const startTime = new Date(day.setHours(0, 0, 0, 0));
        const endTime = new Date(day.setHours(23, 59, 59, 999));

        const revenue = await prisma.orders.aggregate({
          _sum: { total_amount: true },
          where: {
            status: { not: 'canceled' },
            created_at: {
              gte: startTime,
              lte: endTime,
            },
          },
        });

        return {
          day: format(startTime, 'dd/MM'),
          revenue: revenue._sum.total_amount || 0,
        };
      })
    );

    return results;
  },

  async getYearlyRevenueByDate(dateStr) {
    const date = new Date(dateStr);
    const start = startOfYear(date);
    const end = endOfYear(date);

    const months = eachMonthOfInterval({ start, end });

    const results = await Promise.all(
      months.map(async (monthDate) => {
        const startTime = new Date(monthDate.setDate(1));
        startTime.setHours(0, 0, 0, 0);

        const endTime = endOfMonth(startTime);

        const revenue = await prisma.orders.aggregate({
          _sum: { total_amount: true },
          where: {
            status: { not: 'canceled' },
            created_at: {
              gte: startTime,
              lte: endTime,
            },
          },
        });

        return {
          month: format(startTime, 'MM/yyyy'),
          revenue: revenue._sum.total_amount || 0,
        };
      })
    );

    return results;
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
