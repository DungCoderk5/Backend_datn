const prisma = require('../../shared/prisma');

const categoryRepository = {
  async findAll() {
    return await prisma.categories.findMany({
      orderBy: { name: 'asc' },
      include: {
        children: true,
      },
    });
  },

  async create({ name, slug, parent_id }) {
    return await prisma.categories.create({
      data: {
        name,
        slug,
        parent_id: parent_id || null,
        status: 1,
      },
    });
  },

  async update({ category_id, name, slug, parent_id }) {
    return await prisma.categories.update({
      where: { id: category_id },
      data: {
        name,
        slug,
        parent_id: parent_id || null,
        status: 1,
      },
    });
  },

  async delete(categories_id) {
    return await prisma.categories.deleteMany({
      where: {categories_id}
    }
    );
  },
};

module.exports = categoryRepository;