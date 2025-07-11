const prisma = require("../../../shared/prisma");

async function updateUserUsecase(userId, data) {
  const id = parseInt(userId, 10);
  const existingUser = await prisma.users.findUnique({
    where: { user_id: id },
  });

  if (!existingUser) {
    throw new Error("Người dùng không tồn tại");
  }

  const updatedUser = await prisma.users.update({
    where: { user_id: id },
    data: {
      name: data.name ?? existingUser.name,
      phone: data.phone ?? existingUser.phone,
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
      avatar: updatedUser.avatar,
      status: updatedUser.status,
    },
  };
}

module.exports = updateUserUsecase;
