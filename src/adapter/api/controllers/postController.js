const express = require('express');
const router = express.Router();

const {
  getAllPostsHandler,
  addPostHandler,
  deletePostHandler,
  updatePostHandler,
  getPostByIdHandler,
  getPostByCategoryHandler,
  getPostCategoryHandler,
} = require('../../../application/post/postHttpHandler');

router.get('/', getAllPostsHandler);
router.get('/byId/:id', getPostByIdHandler);
router.get('/category', getPostCategoryHandler);
router.get('/category/:categoryId', getPostByCategoryHandler);
router.post('/', addPostHandler);
router.delete('/:id', deletePostHandler);
router.put('/:id', updatePostHandler);
module.exports = router;