const prisma = require("../../shared/prisma");

const productRepository = {
  async findAll({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: { status: true },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          variants: {
            include: {
              color: true,
              size: true,
            },
          },
        },
      }),
      prisma.products.count({ where: { status: true } }),
    ]);

    return {
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },
  async findByIdOrSlug({ id, slug }) {
    const conditions = [];
    if (id !== undefined && id !== null) {
      conditions.push({ products_id: Number(id) });
    }
    if (slug) {
      conditions.push({ slug });
    }

    if (conditions.length === 0) {
      throw new Error("Phải truyền id hoặc slug");
    }

    return await prisma.products.findFirst({
      where: { OR: conditions },
      include: {
        brand: true,
        category: true,
        gender: true,
        images: true,
        variants: {
          include: {
            color: true,
            size: true,
          },
        },
        reviews: true,
      },
    });
  },

  async getBestSelling(top = 3) {
    const products = await prisma.products.findMany({
      where: { status: true },
      include: {
        reviews: true,
        brand: true,
        category: true,
        gender: true,
        images: true,
        variants: {
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
        where: { status: true },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          variants: {
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
        where: { status: true },
      }),
    ]);

    return { data, total };
  },
  async getFeaturedProducts() {
    const products = await prisma.products.findMany({
      where: {
        status: true,
        reviews: {
          some: {}, // Lấy sản phẩm có ít nhất 1 review
        },
      },
      include: {
        brand: true,
        category: true,
        gender: true,
        images: true,
        reviews: true,
        variants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    // Lọc sản phẩm có ít nhất 5 review và rating trung bình ≥ 4
    return products.filter((product) => {
      const reviews = product.reviews || [];
      if (reviews.length < 1) return false;

      const avgRating =
        reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        reviews.length;

      return avgRating >= 4;
    });
  },

  async findProductsByCategory({ categoryName, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const where = {
      status: true,
      category: {
        OR: [
          { name: categoryName.toLowerCase() },
          { slug: categoryName.toLowerCase() },
        ],
      },
    };

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          variants: {
            include: {
              color: true,
              size: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.products.count({
        where,
      }),
    ]);

    return { products, total };
  },

  async findDealProducts({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: {
          status: true,
          NOT: [{ sale_price: null }],
          AND: [{ sale_price: { lt: prisma.products.fields.price } }],
        },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          variants: {
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
          status: true,
          NOT: [{ sale_price: null }],
          AND: [{ sale_price: { lt: prisma.products.fields.price } }],
        },
      }),
    ]);

    return { products, total };
  },
  async findRelatedProductsByCategory({ categoryId, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: {
          status: true,
          categories_id: categoryId,
        },
        include: {
          brand: true,
          category: true,
          gender: true,
          images: true,
          variants: {
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
          status: true,
          categories_id: categoryId,
        },
      }),
    ]);

    return { products, total };
  },
  async findProductsByGender({ genderName, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: {
          status: true,
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
          variants: {
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
          status: true,
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
};

module.exports = productRepository;
