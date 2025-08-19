const prisma = require("../../shared/prisma");

const productRepository = {
  async findByUserId(userId, skip, take, filters = {}, sort = {}, search = "") {
    const normalizedSearch = search.trim().toLowerCase(); // đảm bảo tìm kiếm lowercase

    const where = {
      user_id: userId,
      ...(filters.status && { status: filters.status }),
      ...(filters.payment_method_id
        ? { payment_method_id: filters.payment_method_id }
        : {}),
      ...(filters.date_from && {
        created_at: { gte: new Date(filters.date_from) },
      }),
      ...(filters.date_to && {
        created_at: {
          ...(filters.date_from && { gte: new Date(filters.date_from) }),
          lte: new Date(filters.date_to),
        },
      }),
      ...(normalizedSearch && {
        OR: [
          {
            shipping_address: {
              address_line: {
                contains: normalizedSearch,
              },
            },
          },
          {
            shipping_address: {
              full_name: {
                contains: normalizedSearch,
              },
            },
          },
          {
            shipping_address: {
              phone: {
                contains: normalizedSearch,
              },
            },
          },
          {
            order_items: {
              some: {
                variant: {
                  product: {
                    name: {
                      contains: normalizedSearch,
                    },
                  },
                },
              },
            },
          },
        ],
      }),
    };

    const sortFieldMap = {
      total_price: "total_amount",
    };

    const orderBy = sort.field
      ? { [sortFieldMap[sort.field] || sort.field]: sort.direction || "desc" }
      : { created_at: "desc" };

    const page = Math.max(1, Math.ceil(skip / take) + 1);

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take,
        include: {
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
          payment_method: true,
          shipping_address: true,
          coupon: true,
        },
        orderBy,
      }),
      prisma.orders.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit: take,
        currentPage: page,
        totalPages: Math.ceil(total / take),
      },
    };
  },
  async delete(products_id) {
    // Lấy tất cả color_id từ variants
    const variantColors = await prisma.product_variants.findMany({
      where: { product_id: products_id },
      select: { color_id: true },
    });

    const colorIds = [
      ...new Set(variantColors.map((v) => v.color_id).filter(Boolean)),
    ];

    // Xoá product_variants
    await prisma.product_variants.deleteMany({
      where: { product_id: products_id },
    });

    // Xoá colors (nếu cần)
    if (colorIds.length > 0) {
      await prisma.colors.deleteMany({
        where: { id: { in: colorIds } },
      });
    }

    // Xoá các bảng liên quan
    await prisma.images.deleteMany({ where: { product_id: products_id } });
    await prisma.wishlist_items.deleteMany({
      where: { product_id: products_id },
    });
    await prisma.product_compares.deleteMany({
      where: { product_id: products_id },
    });
    await prisma.product_reviews.deleteMany({
      where: { product_id: products_id },
    });

    // Xoá sản phẩm
    return await prisma.products.delete({
      where: { products_id },
    });
  },
  async findAll({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: { status: 1 },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          product_variants: {
            include: {
              color: true,
              size: true,
            },
          },
        },
      }),
      prisma.products.count({ where: { status: 1 } }),
    ]);

    return {
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },
  async findByIdOrSlug({ id, slug }) {
    return await prisma.products.findFirst({
      where: {
        OR: [
          id ? { products_id: Number(id) } : undefined,
          slug ? { slug } : undefined,
        ].filter(Boolean),
      },
      include: {
        brand: true,
        category: true,
        gender: true,
        images: true,
        product_variants: {
          include: {
            color: true,
            size: true,
          },
        },
        product_reviews: true,
      },
    });
  },
  async findById(productId) {
    return await prisma.products.findUnique({
      where: { products_id: productId },
      include: {
        brand: true,
        category: true,
        gender: true,
        images: true,
        product_variants: {
          include: {
            color: true,
            size: true,
          },
        },
        product_reviews: true,
      },
    });
  },

  async getCouponsByCode(code, total) {
    const coupon = await prisma.coupons.findFirst({
      where: {
        code,
        end_date: {
          gte: new Date(),
        },
        min_order: {
          lte: total,
        },
      },
    });

    if (!coupon) {
      throw new Error(
        "Coupon không tồn tại, đã hết hạn, hoặc chưa đạt giá trị tối thiểu"
      );
    }

    return coupon;
  },

  async getBestSelling(top = 6) {
    const products = await prisma.products.findMany({
      where: { status: 1 },
      include: {
        product_reviews: true,
        brand: true,
        category: true,
        gender: true,
        images: true,
        product_variants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    const withSoldCount = products.map((p) => {
      const reviewCount = p.reviews?.length || 0;
      const sold_count = reviewCount * 10 + Math.floor(Math.random() * 20);
      return { ...p, sold_count };
    });

    return withSoldCount
      .sort((a, b) => b.sold_count - a.sold_count)
      .slice(0, top);
  },
  async getNewest({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.products.findMany({
        where: { status: 1 },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          product_variants: {
            include: {
              // color: true,
              size: true,
            },
          },
        },
        orderBy: { products_id: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.products.count({
        where: { status: 1 },
      }),
    ]);

    return { data, total };
  },
  async getFeaturedProducts() {
    const products = await prisma.products.findMany({
      where: {
        status: 1,
        product_reviews: {
          some: {},
        },
      },
      include: {
        brand: true,
        category: true,
        gender: true,
        images: true,
        product_reviews: true,
        product_variants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    // Lọc các sản phẩm có ít nhất 5 review và rating trung bình ≥ 4
    return products.filter((product) => {
      const reviews = product.product_reviews || [];
      const avgRating =
        reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
      return reviews.length >= 5 && avgRating >= 5;
    });
  },
  async findProductsByCategory({ categoryName, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: {
          status: 1,
          category: {
            OR: [
              { name: { equals: categoryName } },
              { slug: { equals: categoryName } },
            ],
          },
        },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          product_variants: {
            include: {
              color: true,
              size: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.products.count({
        where: {
          status: 1,
          category: {
            OR: [
              { name: { equals: categoryName } },
              { slug: { equals: categoryName } },
            ],
          },
        },
      }),
    ]);

    return { products, total };
  },
  async findDealProducts({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: {
          status: 1,
          NOT: [{ sale_price: null }],
          AND: [{ sale_price: { lt: prisma.products.fields.price } }],
        },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          product_variants: {
            include: {
              color: true,
              size: true,
            },
          },
          product_reviews: true,
        },
        skip,
        take: limit,
        orderBy: [
          { sale_price: "asc" }, // cố định tăng dần
          { price: "asc" },
        ],
      }),

      prisma.products.count({
        where: {
          status: 1,
          NOT: [{ sale_price: null }],
          AND: [{ sale_price: { lt: prisma.products.fields.price } }],
        },
      }),
    ]);

    return { products, total };
  },

  async findRelatedProducts(productId, page = 1, limit = 8) {
    const product = await prisma.products.findUnique({
      where: { products_id: productId },
      select: { categories_id: true },
    });

    if (!product || !product.categories_id)
      return { relatedProducts: [], total: 0 };

    const skip = (page - 1) * limit;

    const [relatedProducts, total] = await Promise.all([
      prisma.products.findMany({
        where: {
          categories_id: product.categories_id,
          products_id: { not: productId },
          status: 1,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          images: true,
          brand: true,
          category: true,
        },
      }),
      prisma.products.count({
        where: {
          categories_id: product.categories_id,
          products_id: { not: productId },
          status: 1,
        },
      }),
    ]);

    return {
      relatedProducts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },
  async findProductsByGender({ genderName, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: {
          status: 1,
          gender: {
            name: {
              in:
                genderName === "male_or_unisex"
                  ? ["Male", "Unisex"]
                  : genderName === "female_or_unisex"
                    ? ["Female", "Unisex"]
                    : [genderName],
            },
          },
        },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          product_variants: {
            include: {
              color: true,
              size: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.products.count({
        where: {
          status: 1,
          gender: {
            name: {
              in:
                genderName === "male_or_unisex"
                  ? ["Male", "Unisex"]
                  : genderName === "female_or_unisex"
                    ? ["Female", "Unisex"]
                    : [genderName],
            },
          },
        },
      }),
    ]);

    return { products, total };
  },
  async createProduct(data) {
    return await prisma.products.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        short_desc: data.short_desc,
        price: data.price,
        sale_price: data.sale_price,
        categories_id: data.categories_id,
        brand_id: data.brand_id,
        gender_id: data.gender_id,
        status: data.status,
        view: 0,
        images: { create: data.images },
      },
      include: { images: true },
    });
  },
async addToCart({ user_id, variant_id, quantity }) {
  let cart = await prisma.carts.findFirst({ where: { user_id } });

  if (!cart) {
    cart = await prisma.carts.create({ data: { user_id } });
  }

  const variant = await prisma.product_variants.findUnique({
    where: { product_variants_id: variant_id },
    include: { product: true },
  });

  if (!variant) {
    throw {
      success: false,
      message: "Product variant not found",
    };
  }

  const existingItem = await prisma.cart_items.findFirst({
    where: { cart_id: cart.carts_id, variant_id },
  });

  const remainingStock = variant.stock_quantity - (existingItem?.quantity || 0);

  // Nếu không còn đủ tồn kho
  if (quantity > remainingStock) {
    return {
      success: false,
      type: remainingStock > 0 ? "NOT_ENOUGH_STOCK" : "OUT_OF_STOCK",
      message: remainingStock > 0 ? "Số lượng không đủ" : "Hết hàng",
      details: {
        remaining: remainingStock,
        requested: quantity,
        productName: variant.product.name,
      },
    };
  }

  // Update hoặc tạo mới cart item
  if (existingItem) {
    await prisma.cart_items.update({
      where: { cart_items_id: existingItem.cart_items_id },
      data: { quantity: existingItem.quantity + quantity, updated_at: new Date() },
    });
  } else {
    await prisma.cart_items.create({
      data: {
        cart_id: cart.carts_id,
        variant_id,
        quantity,
        price: variant.product?.sale_price || variant.product?.price || 0,
      },
    });
  }

  const updatedCartItems = await prisma.cart_items.findMany({
    where: { cart_id: cart.carts_id },
    include: { variant: { include: { product: true, color: true, size: true } } },
  });

  return {
    success: true,
    message: "Thêm sản phẩm vào giỏ hàng thành công",
    cart_id: cart.carts_id,
    user_id,
    items: updatedCartItems.map((item) => ({
      id: item.cart_items_id,
      quantity: item.quantity,
      price: item.price,
      variant: {
        id: item.variant.product_variants_id,
        name: item.variant.product.name,
        color: item.variant.color?.name,
        size: item.variant.size?.name,
        stock: item.variant.stock_quantity,
      },
    })),
  };
},
  async searchByKeyword({ keyword, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const whereClause = {
      status: 1,
      name: {
        contains: keyword,
        lte: "insensitive", // không phân biệt hoa thường
      },
    };

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          product_variants: {
            include: {
              color: true,
              size: true,
            },
          },
        },
      }),
      prisma.products.count({ where: whereClause }),
    ]);

    return {
      products,
      total,
      keyword,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },
  async findAllCoupons() {
    return await prisma.coupons.findMany({
      where: {
        end_date: {
          gte: new Date(),
        },
        start_date: {
          lte: new Date(),
        },
      },
      select: {
        coupons_id: true,
        code: true,
        discount_type: true,
        discount_value: true,
        usage_limit: true,
        used_count: true,
        min_order: true,
        start_date: true,
        end_date: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },
  async addToWishlist({ user_id, product_id }) {
    const existing = await prisma.wishlist_items.findFirst({
      where: { user_id, product_id },
    });

    if (existing) {
      return { message: "Sản phẩm đã có trong danh sách yêu thích." };
    }

    const wishlistItem = await prisma.wishlist_items.create({
      data: {
        user_id,
        product_id,
      },
    });

    return { message: "Đã thêm vào danh sách yêu thích.", data: wishlistItem };
  },
  async deleteFromCompare({ user_id, product_id }) {
    const existing = await prisma.product_compares.findUnique({
      where: {
        unique_user_product: {
          user_id,
          product_id,
        },
      },
    });

    if (!existing) {
      return { message: "Sản phẩm không tồn tại trong danh sách so sánh." };
    }

    const deleted = await prisma.product_compares.delete({
      where: {
        unique_user_product: {
          user_id,
          product_id,
        },
      },
    });

    return {
      message: "Đã xóa sản phẩm khỏi danh sách so sánh.",
      data: deleted,
    };
  },
  async getCompareProductsByUser(user_id) {
    // Lấy danh sách product_compares theo user_id kèm dữ liệu sản phẩm
    const compareItems = await prisma.product_compares.findMany({
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

    return compareItems;
  },
  async getCartItemsByUserId(user_id) {
    const cart = await prisma.carts.findFirst({
      where: { user_id },
    });
    if (!cart) return [];

    return await prisma.cart_items.findMany({
      where: { cart_id: cart.carts_id },
      include: {
        variant: {
          include: {
            product: {
              select: {
                products_id: true,
                name: true,
                price: true,
                sale_price: true,
                images: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  },

  async findReviewsByProductId(productId) {
    return await prisma.product_reviews.findMany({
      where: { product_id: productId, status: "approved" },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  },
  async findAllReview({
    page = 1,
    limit = 10,
    product_reviews_id,
    user_name,
    product_name,
    rating,
    search,
    sortBy = "created_at",
    sortOrder = "desc",
  }) {
    const where = {};

    // Lọc theo ID
    if (product_reviews_id) {
      where.product_reviews_id = Number(product_reviews_id);
    }

    // Lọc theo tên user
    if (user_name) {
      where.user = {
        name: {
          contains: user_name,
          lte: "insensitive",
        },
      };
    }

    // Lọc theo tên product
    if (product_name) {
      where.product = {
        name: {
          contains: product_name,
          lte: "insensitive",
        },
      };
    }

    // Lọc theo đánh giá
    if (rating) {
      where.rating = Number(rating);
    }

    // Search nội dung
    if (search) {
      where.content = {
        contains: search,
        lte: "insensitive",
      };
    }

    // Tính skip & take cho phân trang
    const skip = (page - 1) * limit;
    const take = limit;

    // Lấy dữ liệu
    const data = await prisma.product_reviews.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        user: true, // nếu muốn join user
        product: true, // nếu muốn join product
      },
    });

    // Đếm tổng số bản ghi (phục vụ phân trang)
    const total = await prisma.product_reviews.count({ where });

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  },
  async findByIdReview(product_reviews_id) {
    const data = await prisma.product_reviews.findUnique({
      where: {
        product_reviews_id: Number(product_reviews_id),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            avatar: true,
            ship_addresses: true,
          },
        },
        product: {
          select: {
            name: true,
            short_desc: true,
            product_variants: {
              select: {
                size: { select: { number_size: true } },
                color: { select: { name_color: true, images: true } },
              },
            },
          },
        },
      },
    });
    return data;
  },
  async getStatusReview(product_reviews_id, status) {
    return await prisma.product_reviews.update({
      where: { product_reviews_id },
      data: { status },
    });
  },

  async createReview({ user_id, product_id, rating, content, status }) {
    return await prisma.product_reviews.create({
      data: {
        user_id,
        product_id,
        rating,
        content,
        status,
      },
    });
  },
  async addToComparelist({ user_id, product_id }) {
    const existing = await prisma.product_compares.findFirst({
      where: { user_id, product_id },
    });
    if (existing) {
      const error = new Error("Sản phẩm đã có trong danh sách so sánh.");
      error.statusCode = 409;
      throw error;
    }

    const count = await prisma.product_compares.count({
      where: { user_id },
    });
    if (count >= 3) {
      const error = new Error("Chỉ được so sánh tối đa 3 sản phẩm.");
      error.statusCode = 403;
      throw error;
    }
    const comparelistItem = await prisma.product_compares.create({
      data: {
        user_id,
        product_id,
      },
    });
    return {
      message: "Đã thêm vào danh sách so sánh.",
      data: comparelistItem,
    };
  },
  async filteredProducts({
    keyword,
    gender,
    brand,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    status = 1,
    limit = 12,
    page = 1,
    sortBy = "price",
    sortOrder = "desc",
  }) {
    const offset = (page - 1) * limit;

    const filters = {
      status,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      sale_price: {
        gte: minPrice,
        lte: maxPrice,
      },
      ...(keyword?.trim()
        ? {
            name: {
              contains: keyword,
            },
          }
        : {}),
      ...(gender
        ? {
            gender: {
              name: {
                equals: gender,
              },
            },
          }
        : {}),
      ...(brand
        ? {
            brand: {
              name: {
                equals: brand,
              },
            },
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: filters,
        take: limit,
        skip: offset,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          images: true,
          brand: true,
          gender: true,
          category: true,
          product_variants: {
            include: {
              color: true,
              size: true,
            },
          },
        },
      }),

      prisma.products.count({
        where: filters,
      }),
    ]);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
  async findByBrand(brandId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: {
          brand_id: brandId,
          status: 1,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          product_variants: {
            include: { color: true, size: true },
          },
        },
      }),
      prisma.products.count({
        where: {
          brand_id: brandId,
          status: 1,
        },
      }),
    ]);

    return {
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },
  async updateCartItem({ user_id, variant_id, quantity }) {
    const cart = await prisma.carts.findFirst({
      where: { user_id },
    });

    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng của người dùng");
    }
    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.carts_id,
        variant_id,
      },
    });

    if (existingItem) {
      return await prisma.cart_items.update({
        where: {
          cart_items_id: existingItem.cart_items_id,
        },
        data: {
          quantity,
        },
      });
    } else {
      return await prisma.cart_items.create({
        data: {
          cart_id: cart.carts_id,
          variant_id,
          quantity,
          price: 0,
        },
      });
    }
  },

  async removeFromCart({ user_id, variant_id }) {
    const cart = await prisma.carts.findFirst({
      where: { user_id },
    });

    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng của người dùng.");
    }
    const deleted = await prisma.cart_items.deleteMany({
      where: {
        cart_id: cart.carts_id,
        variant_id,
      },
    });
    const remainingItems = await prisma.cart_items.count({
      where: {
        cart_id: cart.carts_id,
      },
    });

    if (remainingItems === 0) {
      await prisma.carts.delete({
        where: {
          carts_id: cart.carts_id,
        },
      });
    }

    return deleted;
  },

  async createOrder({
    orders_id,
    user_id,
    total_price,
    shipping_address_id,
    payment_method_id,
    coupons_id,
    comment,
    items,
    shipping_fee,
    payment_status = "PROCESSING",
  }) {
    const orderData = {
      user_id,
      total_amount: total_price,
      status: "pending",
      payment_method_id,
      shipping_address_id,
      coupons_id,
      comment,
      shipping_fee: shipping_fee ?? 0,
      payment_status,
      order_items: {
        create: items.map((item) => ({
          variant: {
            connect: { product_variants_id: item.variant_id },
          },
          quantity: item.quantity,
          unit_price: item.price,
        })),
      },
    };

    if (orders_id) {
      orderData.orders_id = orders_id;
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Tạo đơn hàng
      const order = await tx.orders.create({
        data: orderData,
        include: {
          user: true,
          shipping_address: true,
          payment_method: true,
          coupon: true,
          order_items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { select: { url: true }, take: 1 },
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

      // 2. Giảm tồn kho (không kiểm tra trước)
      for (const item of items) {
        await tx.product_variants.update({
          where: { product_variants_id: item.variant_id },
          data: {
            stock_quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });
  },
  async getVoucherByCode(code) {
    return await prisma.coupons.findFirst({
      where: {
        code: code,
      },
    });
  },
  async findUserVouchers(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return await prisma.user_vouchers.findMany({
      where: { user_id: Number(userId) },
      include: {
        coupon: true,
      },
      skip,
      take: limit,
      orderBy: {
        saved_at: "desc", // sắp xếp mới nhất (nếu cần)
      },
    });
  },

  async updatePaymentStatus(orderId, status) {
    await prisma.orders.update({
      where: { orders_id: orderId },
      data: { status }, // ✅ Sửa đúng field có trong schema
    });
  },

  async getOrderById(orderId) {
    return await prisma.orders.findUnique({
      where: { orders_id: orderId },
      include: {
        user: true,
        shipping_address: true,
        payment_method: true,
        coupon: true,
        order_items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      select: {
                        url: true,
                      },
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
  },
  async getVoucherById(id) {
    return await prisma.coupons.findUnique({
      where: {
        coupons_id: Number(id), // Ép kiểu tại đây
      },
    });
  },

  async clearCart(user_id) {
    const cart = await prisma.carts.findFirst({ where: { user_id } });

    if (!cart) {
      console.warn("⚠️ Không tìm thấy giỏ hàng cho user_id:", user_id);
      return;
    }

    await prisma.cart_items.deleteMany({
      where: { cart_id: cart.carts_id },
    });

    await prisma.carts.delete({
      where: { carts_id: cart.carts_id },
    });
  },

  async removeWishlistItemHandler(req, res) {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Thiếu userId hoặc productId." });
    }

    try {
      const result = await removeWishlistItemUsecase(
        parseInt(userId),
        parseInt(productId)
      );

      if (result === null) {
        return res
          .status(404)
          .json({ message: "Mục yêu thích không tồn tại." });
      }

      return res
        .status(200)
        .json({ message: "Đã xóa sản phẩm khỏi wishlist." });
    } catch (error) {
      console.error("[Handler] Lỗi xóa sản phẩm khỏi wishlist:", error);
      return res.status(500).json({ error: "Lỗi máy chủ." });
    }
  },
  async deleteByUserAndProduct(userId, productId) {
    try {
      return await prisma.wishlist_items.deleteMany({
        where: {
          user_id: userId,
          product_id: productId,
        },
      });
    } catch (error) {
      if (error.code === "P2025") return null;
      throw error;
    }
  },
  async updateProduct(productId, data) {
    return await prisma.products.update({
      where: { products_id: productId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        short_desc: data.short_desc,
        price: data.price,
        sale_price: data.sale_price,
        categories_id: data.categories_id,
        brand_id: data.brand_id,
        gender_id: data.gender_id,
        status: data.status,
        ...(data.images?.length > 0 && {
          images: { create: data.images },
        }),
      },
      include: { images: true },
    });
  },
  async countByBrandId(brand_id) {
    return await prisma.products.count({
      where: { brand_id: Number(brand_id) },
    });
  },
  async countByCategoryId(category_id) {
    return await prisma.products.count({
      where: { categories_id: Number(category_id) },
    });
  },
  async findAllPro({
    page = 1,
    limit = 5,
    sortField = "created_at",
    sortOrder = "desc",
    filters = {},
  }) {
    const skip = (page - 1) * limit;
    const andConditions = [];

    if (filters.productName) {
      andConditions.push({
        name: { contains: filters.productName /* , mode: "insensitive" */ },
      });
    }

    if (filters.productCode) {
      andConditions.push({
        product_variants: {
          some: {
            sku: { contains: filters.productCode /* , mode: "insensitive" */ },
          },
        },
      });
    }

    if (filters.brandId) {
      andConditions.push({ brand_id: filters.brandId });
    }

    if (filters.categoryId) {
      andConditions.push({ categories_id: filters.categoryId });
    }

    if (
      filters.minSalePrice !== undefined ||
      filters.maxSalePrice !== undefined
    ) {
      const salePriceFilter = {};
      if (filters.minSalePrice !== undefined)
        salePriceFilter.gte = filters.minSalePrice;
      if (filters.maxSalePrice !== undefined)
        salePriceFilter.lte = filters.maxSalePrice;
      andConditions.push({ sale_price: salePriceFilter });
    }

    if (
      filters.minImportPrice !== undefined ||
      filters.maxImportPrice !== undefined
    ) {
      const priceFilter = {};
      if (filters.minImportPrice !== undefined)
        priceFilter.gte = filters.minImportPrice;
      if (filters.maxImportPrice !== undefined)
        priceFilter.lte = filters.maxImportPrice;
      andConditions.push({ price: priceFilter });
    }

    if (
      filters.minQuantity !== undefined ||
      filters.maxQuantity !== undefined
    ) {
      const quantityFilter = {};
      if (filters.minQuantity !== undefined)
        quantityFilter.gte = filters.minQuantity;
      if (filters.maxQuantity !== undefined)
        quantityFilter.lte = filters.maxQuantity;
      andConditions.push({
        product_variants: {
          some: {
            stock_quantity: quantityFilter,
          },
        },
      });
    }

    const where = {
      status: 1,
      AND: andConditions.length > 0 ? andConditions : undefined,
    };

    const validSortFields = [
      "created_at",
      "name",
      "price",
      "sale_price",
      "view",
    ];
    const safeSortField = validSortFields.includes(sortField)
      ? sortField
      : "created_at";

    const orderBy = {};
    orderBy[safeSortField] =
      sortOrder.toLowerCase() === "desc" ? "desc" : "asc";

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          product_variants: {
            include: {
              color: true,
              size: true,
            },
          },
        },
      }),
      prisma.products.count({ where }),
    ]);

    return {
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },
  async findAllWithoutPaging() {
    return await prisma.sizes.findMany({
      orderBy: { id: "asc" }, // hoặc created_at nếu bạn có cột này
    });
  },
  async findAllGenders() {
    return await prisma.genders.findMany({
      orderBy: { id: "asc" },
    });
  },
};

module.exports = productRepository;
