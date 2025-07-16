const prisma = require('../../shared/prisma');

const brandRepository = {
  async findAll() {
    return await prisma.brands.findMany({
      orderBy: { name: 'asc' }
    });
  },
};

module.exports = brandRepository;