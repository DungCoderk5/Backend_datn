 const getAllPostsUsecase = require('../../infrastructure/usecase/post/getAllPostsUsecase');

async function getAllPostsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getAllPostsUsecase({ page, limit });
    res.status(200).json(result);
  } catch (error) {
    console.error('[Handler] Lỗi getAllPosts:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh sách bài viết.' });
  }
}

module.exports = {
  getAllPostsHandler,
};