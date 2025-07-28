const express = require('express');
const router = express.Router();

const {
  getAllProductCategoriesHandler,
  addCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} = require('../../../application/category/categoryHttpHandler');

router.get('/', getAllProductCategoriesHandler);
router.post('/', addCategoryHandler);
router.put('/update/:id', updateCategoryHandler);
router.delete('/delete/:id', deleteCategoryHandler);

module.exports = router;