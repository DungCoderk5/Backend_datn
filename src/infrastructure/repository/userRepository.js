const prisma = require("../../shared/prisma");

async function findByUsernameOrEmail(usernameOrEmail) {
  return await prisma.users.findFirst({
    where: {
      OR: [
        { email: usernameOrEmail },
        { name: usernameOrEmail },
      ],
    },
  });
}
async function create(data) {
    return await prisma.users.create({
      data
    });
  }
async function findById(userId) {
  return await prisma.users.findUnique({
    where: { user_id: userId },
  });
}

async function createAddress(userId, addressData) {
  return await prisma.ship_address.create({
    data: {
      user_id: userId,
      ...addressData
    }
  });
}

async function findAll({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          user_id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          created_at: true,
        },
      }),
      prisma.users.count(),
    ]);

    return {
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
}

async function updatePassword(userId, newHashedPassword) {
    return await prisma.users.update({
      where: { user_id: userId },
      data: {
        password: newHashedPassword,
        updated_at: new Date(),
      },
    });
}

async function findById(userId) {
  if (!userId) {
    throw new Error('Thiếu userId');
  }

  return await prisma.users.findUnique({
    where: { user_id: userId },
  });
}

module.exports = {
  findByUsernameOrEmail,
  createAddress,
  findAll,
  updatePassword,
  findById,
  create
};
