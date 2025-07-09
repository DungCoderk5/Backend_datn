const prisma = require('../../shared/prisma');

const postRepository = {
  async findAll({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.posts.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
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
};

module.exports = postRepository;