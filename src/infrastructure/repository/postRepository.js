const prisma = require("../../shared/prisma");

const postRepository = {
  async findAll({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.posts.findMany({
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
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
      prisma.posts.count(),
    ]);

    return {
      posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async findCate() {
    return await prisma.categories_post.findMany({})
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
}
,


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
    where:  category_post_id ,
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
}

};

module.exports = postRepository;
