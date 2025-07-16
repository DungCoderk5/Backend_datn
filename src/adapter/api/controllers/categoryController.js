const express = require('express');
const router = express.Router();

const {
  getAllProductCategoriesHandler
} = require('../../../application/category/categoryHttpHandler');

router.get('/', getAllProductCategoriesHandler);

module.exports = router;