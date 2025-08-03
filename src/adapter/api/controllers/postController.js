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
  upLoadHandler
} = require('../../../application/post/postHttpHandler');

router.get('/', getAllPostsHandler);
router.get('/byId/:id', getPostByIdHandler);
router.get('/category', getPostCategoryHandler);
router.get('/category/:categoryId', getPostByCategoryHandler);
router.post('/', uploadBlog.single('thumbnail'), validateRealImage, addPostHandler);
router.post('/upload', uploadBlog.single('image'), validateRealImage, upLoadHandler);
router.delete('/delete/:id', deletePostHandler);
router.put('/update/:id', updatePostHandler);
module.exports = router;