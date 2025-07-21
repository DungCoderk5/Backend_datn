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
};

module.exports = categoryRepository;