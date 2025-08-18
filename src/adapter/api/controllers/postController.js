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
  upLoadHandler,
  getPostBySlugHandler,
  createCategoryPostHandler,
  deleteCategoryPostHandler,
  updateCategoryHandler,
  getCategoryPostIdHandler,
  getPostsByCategoryHandler,
} = require('../../../application/post/postHttpHandler');

router.get('/', getAllPostsHandler);
router.get('/byId/:id', getPostByIdHandler);
router.get('/bySlug/:slug', getPostBySlugHandler);
router.get('/category', getPostCategoryHandler);
router.get('/category/:categoryId', getPostByCategoryHandler);
router.post('/', uploadBlog.single('thumbnail'), validateRealImage, addPostHandler);
router.post('/upload', uploadBlog.single('image'), validateRealImage, upLoadHandler);
router.delete('/delete/:id', deletePostHandler);
router.put('/update/:id',uploadBlog.single('thumbnail'),validateRealImage, updatePostHandler);
router.post('/create-category', createCategoryPostHandler);
router.delete('/delete-category/:id', deleteCategoryPostHandler);
router.put('/update-category/:id',updateCategoryHandler
);
router.get('/category/byCategoryId/:id', getCategoryPostIdHandler);
router.get("/postbycategory", getPostsByCategoryHandler);

module.exports = router;