const prisma = require("../../shared/prisma");

const brandRepository = {
 // brandRepository.js
async findAll({ page = 1, limit = 5, id, name, status, keyword, sortBy = 'created_at', sortOrder = 'desc' }) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};

  if (id) {
    where.brand_id = Number(id);
  }
  if (name) {
    where.name = { contains: name, mode: "insensitive" };
  }
  if (status !== undefined && status !== "") {
    where.status = Number(status);
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    where.OR = [
      { name: { contains: lowerKeyword, mode: "insensitive" } },
      !isNaN(Number(keyword)) ? { brand_id: Number(keyword) } : null,
      !isNaN(Number(keyword)) ? { status: Number(keyword) } : null,
    ].filter(Boolean);
  }

  const [data, total] = await Promise.all([
    prisma.brands.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    prisma.brands.count({ where }),
  ]);

  return {
    data,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    hasNextPage: Number(page) < Math.ceil(total / limit),
  };
},
  async create({ name, slug, logo_url }) {
    return await prisma.brands.create({
      data: {
        name,
        slug,
        logo_url,
        status: 1,
      },
    });
  },
  async update({ brand_id, name, slug, logo_url, status }) {
    return await prisma.brands.update({
      where: { brand_id },
      data: {
        name,
        slug,
        logo_url,
        status: status ?? 1,
      },
    });
  },

  async delete(brand_id) {
    return await prisma.brands.delete({
      where: { brand_id },
    });
  },
};

module.exports = brandRepository;
