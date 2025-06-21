const prisma = require("../../../shared/prisma");

async function updateUserUsecase(userId, data) {
  const existingUser = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (!existingUser) {
    throw new Error("Người dùng không tồn tại");
  }

  const updatedUser = await prisma.users.update({
    where: { user_id: userId },
    data: {
      name: data.name ?? existingUser.name,
      phone: data.phone ?? existingUser.phone,
      address: data.address ?? existingUser.address,
      avatar: data.avatar ?? existingUser.avatar,
      status: data.status ?? existingUser.status,
    },
  });

  return {
    message: "Cập nhật thông tin thành công",
    user: {
      id: updatedUser.user_id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      status: updatedUser.status,
    },
  };
}

module.exports = updateUserUsecase;
