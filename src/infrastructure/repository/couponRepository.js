const prisma = require("../../shared/prisma");

const couponRepository = {
  async findAll({
    page = 1,
    limit = 5,
    id,
    code,
    keyword,
    discount_type,
    start_date,
    end_date,
    usage_limit,
    used_count,
    min_order,
    sortBy = "code",
    sortOrder = "asc",
  } = {}) {
    const skip = (page - 1) * limit;
    const where = {};

    if (id) {
      where.coupons_id = Number(id);
    }

    if (code) {
      where.code = { contains: code };
    }

    if (keyword) {
      const orFilters = [
        { code: { contains: keyword } },
        !isNaN(Number(keyword)) ? { coupons_id: Number(keyword) } : null,
        // thêm các trường khác cần search nếu muốn
      ].filter(Boolean);

      where.OR = orFilters;
    }

    if (discount_type) {
      where.discount_type = discount_type;
    }

    if (start_date) {
      // Lọc start_date >= ngày bắt đầu từ
      where.start_date = { gte: new Date(start_date) };
    }

    if (end_date) {
      // Lọc end_date <= ngày kết thúc đến
      where.end_date = { lte: new Date(end_date) };
    }

    if (usage_limit !== undefined) {
      where.usage_limit = usage_limit;
    }

    if (used_count !== undefined) {
      where.used_count = used_count;
    }

    if (min_order !== undefined) {
      where.min_order = min_order;
    }

    // Validate sortBy để tránh lỗi hoặc SQL Injection
    const allowedSortFields = [
      "coupons_id",
      "code",
      "discount_value",
      "start_date",
      "end_date",
      "created_at",
      "updated_at",
    ];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : "code";
    const orderDirection = sortOrder === "desc" ? "desc" : "asc";

    const [data, total] = await Promise.all([
      prisma.coupons.findMany({
        where,
        orderBy: { [orderField]: orderDirection },
        skip,
        take: limit,
      }),
      prisma.coupons.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    };
  },
  // backend: couponRepository.js
  async create(data) {
    return await prisma.coupons.create({
      data: {
        code: data.code,
        discount_type: data.discount_type,
        discount_value: Number(data.discount_value), // Ép kiểu số
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        usage_limit: data.usage_limit,
        used_count: data.used_count,
        min_order: data.min_order,
      },
    });
  },
  async update(id, data) {
    return await prisma.coupons.update({
      where: { coupons_id: id },
      data: {
        code: data.code,
        discount_type: data.discount_type,
        discount_value: Number(data.discount_value),
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        usage_limit: data.usage_limit,
        used_count: data.used_count,
        min_order: data.min_order,
      },
    });
  },
  async findById(id) {
    return await prisma.coupons.findUnique({
      where: { coupons_id: id },
    });
  },
  
};

module.exports = couponRepository;
