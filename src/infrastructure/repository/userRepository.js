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

const createAddress = async (userId, addressData) => {
  return await prisma.ship_address.create({
    data: {
      user_id: userId,
      ...addressData
    }
  });
};

module.exports = {
  findByUsernameOrEmail,
  createAddress,
  findById,
  create
};
