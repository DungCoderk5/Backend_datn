const prisma = require("../../shared/prisma");

const categoryRepository = {
  async findAll({
    page = 1,
    limit = 5,
    id,
    name,
    status,
    keyword,
    sortBy = "name",
    sortOrder = "asc",
  } = {}) {
    const skip = (page - 1) * limit;

    const where = {};

    if (id) {
      where.categories_id = Number(id);
    }

    if (name) {
      where.name = { contains: name };
    }

    if (status !== undefined && status !== "") {
      where.status = Number(status);
    }

    if (keyword) {
      const orFilters = [
        { name: { contains: keyword } },
        !isNaN(Number(keyword)) ? { categories_id: Number(keyword) } : null,
        !isNaN(Number(keyword)) ? { status: Number(keyword) } : null,
      ].filter(Boolean);

      where.OR = orFilters;
    }

    // Validate sortBy để tránh lỗi hoặc SQL Injection (có thể tùy chỉnh theo cột có thể sort)
    const allowedSortFields = [
      "categories_id",
      "name",
      "created_at",
      "updated_at",
      "status",
    ];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : "name";

    // Validate sortOrder
    const orderDirection = sortOrder === "desc" ? "desc" : "asc";

    const [data, total] = await Promise.all([
      prisma.categories.findMany({
        where,
        orderBy: { [orderField]: orderDirection },
        include: { children: true },
        skip,
        take: limit,
      }),
      prisma.categories.count({ where }),
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
  async create({ name, slug, parent_id, image, status }) {
    return await prisma.categories.create({
      data: {
        name,
        slug,
        parent_id: parent_id || null,
        image: image || null,
        status: status ?? 1, // giữ nguyên nếu 0, mặc định là 1
      },
    });
  },
  async findById(categories_id) {
    return await prisma.categories.findUnique({
      where: { categories_id: Number(categories_id) },
    });
  },

  async update({ categories_id, name, slug, parent_id, image, status }) {
    return await prisma.categories.update({
      where: { categories_id },
      data: {
        name,
        slug,
        parent_id: parent_id || null,
        image,
        status,
      },
    });
  },

  async updateStatus(categories_id, status) {
    return await prisma.categories.update({
      where: { categories_id: Number(categories_id) },
      data: { status },
    });
  },

  async delete(categories_id) {
    return await prisma.categories.deleteMany({
      where: { categories_id },
    });
  },
  async findAllWithoutPaging() {
    return await prisma.categories.findMany({
      include: { children: true },
      orderBy: { name: "asc" },
    });
  },
};

module.exports = categoryRepository;
