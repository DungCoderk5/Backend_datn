const express = require('express');
const router = express.Router();

const {
  getAllProductBrandHandler
} = require('../../../application/brand/brandHttpHandler');

router.get('/', getAllProductBrandHandler);

module.exports = router;