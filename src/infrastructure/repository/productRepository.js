const prisma = require("../../shared/prisma");

const productRepository = {
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
  async getBestSelling(top = 4) {
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
              color: true,
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

      return reviews.length >= 5 && avgRating >= 4;
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
  async create(data) {
    const {
      name,
      slug,
      description,
      short_desc,
      price,
      sale_price,
      categories_id,
      brand_id,
      gender_id,
      images = [],
      product_variants = [],
    } = data;

    const newProduct = await prisma.products.create({
      data: {
        name,
        slug,
        description,
        short_desc,
        price,
        sale_price,
        categories_id,
        brand_id,
        gender_id,
        status: 1,
        images: {
          create: images, // mảng: [{ url, alt_text, type }]
        },
        product_variants: {
          create: product_variants, // mảng: [{ color_id, size_id, stock_quantity, sku, image }]
        },
      },
      include: {
        images: true,
        product_variants: true,
      },
    });

    return newProduct;
  },
  async addToCart({ user_id, variant_id, quantity }) {
    let cart = await prisma.carts.findFirst({
      where: { user_id },
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: {
          user_id,
        },
      });
    }

    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.carts_id,
        variant_id,
      },
    });

    if (existingItem) {
      await prisma.cart_items.update({
        where: { cart_items_id: existingItem.cart_items_id },
        data: {
          quantity: existingItem.quantity + quantity,
          updated_at: new Date(),
        },
      });
    } else {
      const variant = await prisma.product_variants.findUnique({
        where: { product_variants_id: variant_id },
        include: {
          product: true,
        },
      });

      if (!variant) {
        throw new Error("Product variant not found");
      }

      await prisma.cart_items.create({
        data: {
          cart_id: cart.carts_id,
          variant_id,
          quantity,
          price: variant.product?.price || 0,
        },
      });
    }

    const updatedCartItems = await prisma.cart_items.findMany({
      where: { cart_id: cart.carts_id },
      include: {
        variant: {
          include: {
            product: true,
            color: true,
            size: true,
          },
        },
      },
    });

    return updatedCartItems;
  },
  async searchByKeyword({ keyword, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const whereClause = {
      status: true,
      name: {
        contains: keyword,
        mode: "insensitive", // không phân biệt hoa thường
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
    return await prisma.cart.findMany({
      where: { user_id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });
  },
  async findReviewsByProductId(productId) {
    return await prisma.product_reviews.findMany({
      where: { product_id: productId },
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
  async createReview({ user_id, product_id, rating, content }) {
    return await prisma.product_reviews.create({
      data: {
        user_id,
        product_id,
        rating,
        content,
      },
    });
  },
  async addToComparelist({ user_id, product_id }) {
    const existing = await prisma.product_compares.findFirst({
      where: { user_id, product_id },
    });

    if (existing) {
      return { message: "Sản phẩm đã có trong danh sách so sánh." };
    }

    const comparelistItem = await prisma.product_compares.create({
      data: {
        user_id,
        product_id,
      },
    });

    return { message: "Đã thêm vào danh sách so sánh.", data: comparelistItem };
  },
  async filteredProducts({
    keyword = "",
    gender,
    brand,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    status = 1,
    limit = 12,
    offset = 0,
  }) {
    return prisma.products.findMany({
      where: {
        status,
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        gender: gender
          ? {
              name: {
                equals: gender,
                mode: "insensitive",
              },
            }
          : undefined,
        brand: brand
          ? {
              name: {
                equals: brand,
                mode: "insensitive",
              },
            }
          : undefined,
      },
      include: {
        brand: true,
        gender: true,
        category: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        created_at: "desc",
      },
    });
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
  async updateCart({ user_id, product_id, quantity }) {
    return await prisma.cart.upsert({
      where: {
        user_id_product_id: {
          user_id,
          product_id,
        },
      },
      update: { quantity },
      create: {
        user_id,
        product_id,
        quantity,
      },
    });
  },
  async removeFromCart({ user_id, product_id }) {
    return await prisma.carts.deleteMany({
      where: { user_id },
    });
  },
  async createOrder({
    user_id,
    total_price,
    shipping_address,
    payment_method,
    items,
  }) {
    return await prisma.orders.create({
      data: {
        user_id,
        total_price,
        shipping_address,
        payment_method,
        status: "pending",
        order_items: {
          create: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        order_items: true,
      },
    });
  },
  async clearCart(user_id) {
    return await prisma.cart.deleteMany({ where: { user_id } });
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
      return await prisma.wishlist_items.delete({
        where: {
          user_id_product_id: {
            user_id: userId,
            product_id: productId,
          },
        },
      });
    } catch (error) {
      if (error.code === "P2025") return null;
      throw error;
    }
  },
};

module.exports = productRepository;
