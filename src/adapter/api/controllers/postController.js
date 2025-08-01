const express = require('express');
const router = express.Router();
const { uploadBlog, validateRealImage } = require("../../middlewares/uploadPost");


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
router.post('/', uploadBlog.single('thumbnail'), validateRealImage, addPostHandler);
router.delete('/delete/:id', deletePostHandler);
router.put('/update/:id', updatePostHandler);
module.exports = router;