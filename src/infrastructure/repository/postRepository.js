const prisma = require("../../shared/prisma");

const postRepository = {
  async findAll({
    page = 1,
    limit = 10,
    title = "",
    id,
    status,
    sortBy = "created_at", // created_at, updated_at, or title
    sortOrder = "desc", // asc or desc
  }) {
    const skip = (page - 1) * limit;
    const validStatuses = [0, 1];

    const whereClause = {
      AND: [
        id ? { post_id: Number(id) } : {},
        title
          ? {
              title: {
                contains: title,
                lte: "insensitive",
              },
            }
          : {},
        validStatuses.includes(status) ? { status: Number(status) } : {},
      ],
    };

    // Validate sortBy to prevent invalid fields
    const allowedSortFields = ["title", "created_at", "updated_at"];
    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";
    const sortDirection = sortOrder === "asc" ? "asc" : "desc";

    const [posts, total] = await Promise.all([
      prisma.posts.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortField]: sortDirection,
        },
        where: whereClause,
        include: {
          category_post: true,
          author: {
            select: {
              user_id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),

      prisma.posts.count({
        where: whereClause,
      }),
    ]);

    return {
      posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findCate({
    page = 1,
    limit = 10,
    id,
    name,
    slug,
    sortBy = "created_at",
    sortOrder = "desc",
  }) {
    const where = {};

    if (id) {
      where.category_post_id = id;
    }

    if (name) {
      where.name = {
        contains: name,
        lte: "insensitive",
      };
    }

    if (slug) {
      where.slug = slug;
    }

    const validSortFields = ["name", "created_at", "updated_at"];
    if (!validSortFields.includes(sortBy)) {
      sortBy = "created_at"; // mặc định
    }

    sortOrder = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

    const [data, total] = await Promise.all([
      prisma.categories_post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.categories_post.count({ where }),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async create({
    title,
    slug,
    content,
    thumbnail,
    images,
    category_post_id,
    author_id,
    status = 1,
  }) {
    return await prisma.posts.create({
      data: {
        title,
        slug,
        content,
        thumbnail,
        images,
        category_post_id,
        author_id,
        status,
      },
    });
  },

  async findBySlug({ slug }) {
    return await prisma.posts.findUnique({
      where: { slug },
    });
  },

  async findById(post_id) {
    return await prisma.posts.findUnique({
      where: { post_id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category_post: {
          select: {
            category_post_id: true,
            name: true, // nếu bạn muốn lấy tên chuyên mục
          },
        },
      },
    });
  },
  async delete(post_id) {
    return await prisma.posts.delete({
      where: { post_id },
    });
  },

  async update(post_id, data) {
    return await prisma.posts.update({
      where: { post_id },
      data,
    });
  },

  async findByCate(category_post_id) {
    return await prisma.posts.findMany({
      where: { category_post_id },
      select: {
        post_id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        images: true,
        status: true,
        created_at: true,
        category_post: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },
  async createCategory({ name, slug, parent_id }) {
    return await prisma.categories_post.create({
      data: {
        name,
        slug,
        parent_id,
      },
    });
  },
  async deleteCategory(category_post_id) {
    return await prisma.categories_post.delete({
      where: { category_post_id },
    });
  },
  async updateCategory(category_post_id, data) {
    return await prisma.categories_post.update({
      where: { category_post_id },
      data,
    });
  },
  async findCategoryById(category_post_id) {
    return await prisma.categories_post.findUnique({
      where: { category_post_id: Number(category_post_id) },
    });
  },
  async updateViewPost(post_id) {
    return await prisma.posts.update({
      where: { post_id: Number(post_id) },
      data: { view: { increment: 1 } },
    });
  },
  async findFeaturedPost(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const posts = await prisma.posts.findMany({
    where: {
      view: {
        gt: 10, // chỉ lấy bài có view > 10
      },
    },
    orderBy: {
      view: "desc", // sắp xếp view giảm dần
    },
    skip,
    take: limit,
  });

  const total = await prisma.posts.count({
    where: {
      view: {
        gt: 10,
      },
    },
  });

  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

};

module.exports = postRepository;
