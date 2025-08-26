const prisma = require("../../shared/prisma");
const {
  startOfWeek,
  addDays,
  format,
  isAfter,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
} = require("date-fns");

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
          status: { not: "cancelled" },
          created_at: {
            gte: start,
            lte: end,
          },
        },
      });

      result.push({
        day: format(start, "EEEE (dd/MM)"),
        revenue: revenue._sum.total_amount || 0,
      });
    }

    return result;
  },

  async getDailyRevenueByDate(date) {
    const today = date || new Date();
    const result = await prisma.orders.aggregate({
      _sum: { total_amount: true },
      where: {
        status: { not: "cancelled" },
        created_at: {
          today,
        },
      },
    });
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
            status: { not: "cancelled" },
            created_at: {
              gte: startTime,
              lte: endTime,
            },
          },
        });

        return {
          day: format(startTime, "dd/MM"),
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
            status: { not: "cancelled" },
            created_at: {
              gte: startTime,
              lte: endTime,
            },
          },
        });

        return {
          month: format(startTime, "MM/yyyy"),
          revenue: revenue._sum.total_amount || 0,
        };
      })
    );

    return results;
  },
  async getTotalRevenueByDay(dateStr) {
    const date = new Date(dateStr);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    const revenue = await prisma.orders.aggregate({
        _sum: { total_amount: true },
        where: {
          status: { not: "cancelled" },
          created_at: {
            gte: start,
            lte: end,
          },
        },
      }),
      totalRevenue = revenue._sum.total_amount || 0;
    return totalRevenue;
  },
  async getTotalRevenueByWeek(dateStr) {
    const date = new Date(dateStr);
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = addDays(start, 6);
    const revenue = await prisma.orders.aggregate({
      _sum: { total_amount: true },
      where: {
        status: { not: "cancelled" },
        created_at: {
          gte: start,
          lte: end,
        },
      },
    });
    return revenue._sum.total_amount || 0;
  },
  async getTotalRevenueByMonth(dateStr) {
    const date = new Date(dateStr);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const revenue = await prisma.orders.aggregate({
      _sum: { total_amount: true },
      where: {
        status: { not: "cancelled" },
        created_at: {
          gte: start,
          lte: end,
        },
      },
    });
    return revenue._sum.total_amount || 0;
  },
  async getTotalRevenueByYear(dateStr) {
    const date = new Date(dateStr);
    const start = startOfYear(date);
    const end = endOfYear(date);
    const revenue = await prisma.orders.aggregate({
      _sum: { total_amount: true },
      where: {
        status: { not: "cancelled" },
        created_at: {
          gte: start,
          lte: end,
        },
      },
    });
    return revenue._sum.total_amount || 0;
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
  async getLowStockProducts() {
    return await prisma.product_variants.findMany({
      where: {
        stock_quantity: {
          lt: 5,
          gt: 0,
        },
      },
      select: {
        stock_quantity: true,
        product: {
          select: {
            name: true,
          },
        },
        color: {
          select: {
            images: true,
          },
        },
      },
    });
  },
  async getBestSellingProduct() {
    const orderItems = await prisma.order_items.findMany({
      select: {
        quantity: true,
        unit_price: true, // 👈 Thêm dòng này để tính doanh thu
        variant: {
          select: {
            product_id: true,
            product: {
              select: {
                name: true,
                price: true,
                sale_price: true,
                images: {
                  select: {
                    url: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const productSalesMap = new Map();

    for (const item of orderItems) {
      const productId = item.variant.product_id;
      const product = item.variant.product;
      const revenue = item.quantity * item.unit_price;

      if (!productId || !product) continue;

      if (!productSalesMap.has(productId)) {
        productSalesMap.set(productId, {
          product_id: productId,
          name: product.name,
          price: product.price,
          sale_price: product.sale_price,
          image:
            product.images.find((img) => img.type === "thumbnail")?.url ||
            product.images[0]?.url ||
            null,
          sold_count: 0,
          revenue: 0,
        });
      }

      const productData = productSalesMap.get(productId);
      productData.sold_count += item.quantity;
      productData.revenue += revenue;
    }

    const sorted = Array.from(productSalesMap.values()).sort(
      (a, b) => b.sold_count - a.sold_count
    );

    // chỉ lấy 5 sản phẩm bán chạy nhất
    return sorted.slice(0, 5);
  },
  async getPendingOrders() {
    return await prisma.orders.findMany({
      where: {
        status: "pending",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        order_items: {
          select: {
            quantity: true,
            unit_price: true,
            variant: {
              select: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },
  async getOrdersWithFilters({
    page = 1,
    limit = 10,
    search = "",
    status,
    categoryId = null,
    sortField = "created_at", // mặc định sắp xếp theo ngày đặt
    sortOrder = "desc", // mặc định giảm dần
  }) {
    const offset = (page - 1) * limit;

    // Mapping sortField từ client sang đúng field Prisma
    const sortMapping = {
      name: { user: { name: sortOrder } },
      phone: { user: { phone: sortOrder } },
      created_at: { created_at: sortOrder },
    };

    return await prisma.orders.findMany({
      skip: offset,
      take: limit,
      orderBy: sortMapping[sortField] || { created_at: "desc" }, // nếu không khớp thì fallback
      where: {
        status: status || undefined,
        user: {
          OR: [
            { name: { contains: search, lte: "insensitive" } },
            { phone: { contains: search, lte: "insensitive" } },
          ],
        },
        order_items: categoryId
          ? {
              some: {
                variant: {
                  product: {
                    categories_id: Number(categoryId),
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        shipping_address: {
          select: {
            address_line: true,
            phone: true,
          },
        },
        payment_method: {
          select: {
            name_method: true,
          },
        },
        order_items: {
          select: {
            quantity: true,
            unit_price: true,
            variant: {
              select: {
                product: {
                  select: {
                    name: true,
                    category: {
                      select: {
                        categories_id: true,
                        name: true,
                      },
                    },
                  },
                },
                color: {
                  select: {
                    name_color: true,
                    images: true,
                  },
                },
                size: {
                  select: {
                    number_size: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },
  async countOrdersWithFilters({ search = "", status, categoryId = null }) {
    return await prisma.orders.count({
      where: {
        status: status || undefined,
        user: {
          OR: [
            { name: { contains: search, lte: "insensitive" } },
            { phone: { contains: search, lte: "insensitive" } },
          ],
        },
        order_items: categoryId
          ? {
              some: {
                variant: {
                  product: {
                    categories_id: Number(categoryId), // hoặc category: { id: categoryId }
                  },
                },
              },
            }
          : undefined,
      },
    });
  },
  async findAllCategoryProduct() {
    return await prisma.categories.findMany();
  },
};
module.exports = dashboardRepository;
