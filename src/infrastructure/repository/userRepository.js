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
          status: 1,
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

async function findByUserId(userId) {
    const cart = await prisma.carts.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      take: 1,
                    },
                  },
                },
                color: true,
                size: true,
              },
            },
          },
        },
      },
    });

    return cart;
}

async function findAddressByUserId(userId) {
  return await prisma.ship_address.findMany({
    where: { user_id: userId },
    orderBy: { is_default: 'desc' },
  });
}

async function updateAddress(addressId, payload) {
  return await prisma.ship_address.update({
    where: { ship_address_id: addressId },
    data: {
      ...payload,
      updated_at: new Date(),
    },
  });
}

async function deleteAddress(addressId) {
  await prisma.ship_address.delete({
    where: { ship_address_id: addressId },
  });
  return { message: 'Đã xóa địa chỉ thành công.' };
}

async function findBasicInfo(userId) {
  return await prisma.users.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      address: true,
      role: true,
      status: 1,
      created_at: true,
    },
  });
}

async function findReviewsByUserId(userId) {
    return await prisma.product_reviews.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        product: {
          select: {
            products_id: true,
            name: true,
            images: {
              take: 1,
            },
          },
        },
      },
    });
}
module.exports = {
  findByUsernameOrEmail,
  createAddress,
  findAll,
  updatePassword,
  findById,
  create,
  findByUserId,
  deleteAddress,
  updateAddress,
  findAddressByUserId,
  findBasicInfo,
  findReviewsByUserId
};
