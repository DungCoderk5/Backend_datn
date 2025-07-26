const express = require('express');
const router = express.Router();

const {
  getAllProductBrandHandler,
  addBrandHandler,
  updateBrandHandler,
  deleteBrandHandler,
} = require('../../../application/brand/brandHttpHandler');

router.get('/', getAllProductBrandHandler);
router.post('/', addBrandHandler);
router.put('/:id', updateBrandHandler);
router.delete('/:id', deleteBrandHandler);

module.exports = router;