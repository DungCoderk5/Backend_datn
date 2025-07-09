const express = require('express');
const router = express.Router();

const {
  getAllPostsHandler
} = require('../../../application/post/postHttpHandler');

router.get('/', getAllPostsHandler);

module.exports = router;