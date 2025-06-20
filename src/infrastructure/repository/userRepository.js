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
};
