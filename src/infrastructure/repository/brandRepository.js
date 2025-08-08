const prisma = require("../../shared/prisma");

const brandRepository = {
  async findAll() {
    return await prisma.brands.findMany({
      orderBy: { name: "asc" },
    });
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
        status: 1,
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
