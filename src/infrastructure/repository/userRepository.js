const prisma = require("../../shared/prisma");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function findByUsernameOrEmail(usernameOrEmail) {
  return await prisma.users.findFirst({
    where: {
      OR: [{ email: usernameOrEmail }, { name: usernameOrEmail }],
    },
  });
}

async function findByEmail(email) {
  return await prisma.users.findFirst({
    where: {email}
  });
}

async function ResetPass(email, hashedPassword) {
  return await prisma.users.update({
    where: { email },
    data: {
      password: hashedPassword,
      updated_at: new Date(),
      verify_otp: null,
    },
  });
}

async function findAddressById(addressid) {
  return await prisma.ship_address.findUnique({
    where: { ship_address_id: addressid },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
}

async function confirm(email, token) {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  if (user.status === 1) {
    throw new Error("Email đã được xác nhận trước đó");
  }

  if (user.verify_otp !== token) {
    throw new Error("Token xác nhận không hợp lệ");
  }

  return await prisma.users.update({
    where: { email },
    data: {
      status: 1,
      verify_otp: null,
      updated_at: new Date(),
    },
  });
}

async function setOTP(email, OTP) {
  return await prisma.users.update({
    where: { email },
    data: {
      verify_otp: OTP
    },
  });
}

async function findDefaultAddress(userId) {
  if (!userId) {
    throw new Error("Thiếu userId");
  }

  const address = await prisma.ship_address.findFirst({
    where: {
      user_id: userId,
      is_default: true,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!address) {
    throw new Error("Địa chỉ mặc định không tìm thấy");
  }

  return address;
}

async function sendMail({ to, subject, html }) {
  return await transporter.sendMail({
    from: `"DATN Store" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}

async function create(data) {
  return await prisma.users.create({
    data,
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
      ...addressData,
    },
  });
}

async function getOrderDetailById(orderId) {
  return prisma.orders.findUnique({
    where: { orders_id: orderId },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          email: true,
          phone: true,
          status: 1,
          created_at: true,
        },
      },
      shipping_address: true,
      payment_method: true,
      coupon: true,
      order_items: {
        include: {
          variant: {
            include: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      },
    },
  });
}

async function findAll({ page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.users.findMany({
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
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
    throw new Error("Thiếu userId");
  }

  return await prisma.users.findUnique({
    where: { user_id: userId },
  });
}

async function findWishlistByUserId(user_id) {
  if (!user_id || isNaN(user_id)) {
    throw new Error("Invalid userId passed to findWishlistByUserId");
  }

  try {
    const wishlist = await prisma.wishlist_items.findMany({
      where: { user_id },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            gender: true,
            images: true,
            product_variants: true,
          },
        },
      },
    });
    return wishlist;
  } catch (error) {
    throw new Error(`Error fetching wishlist: ${error.message}`);
  }
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
    orderBy: { is_default: "desc" },
  });
}

async function updateAddress(addressId, payload) {
  return await prisma.ship_address.update({
    where: { ship_address_id: addressId },
    data: {
      ...payload,
    },
  });
}

async function deleteAddress(addressId) {
  await prisma.ship_address.delete({
    where: { ship_address_id: addressId },
  });
  return { message: "Đã xóa địa chỉ thành công." };
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
      role: true,
      status: 1,
      created_at: true,
    },
  });
}

async function findReviewsByUserId(userId) {
  return await prisma.product_reviews.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
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
  findReviewsByUserId,
  getOrderDetailById,
  findWishlistByUserId,
  sendMail,
  findDefaultAddress,
  confirm,
  findAddressById,
  setOTP,
  findByEmail,
  ResetPass
};
