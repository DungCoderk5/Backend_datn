
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../adapter/api/controllers/userController');
const productController = require('../adapter/api/controllers/productController');
const categoryController = require('../adapter/api/controllers/categoryController');
const postController = require('../adapter/api/controllers/postController');
const cookieParser = require("cookie-parser"); 
const cors = require('cors');
const path = require("path")
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',  
  credentials: true                
}));
app.set('trust proxy', false);
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/', userController);

app.use('/product', productController);

app.use('/category', categoryController);

app.use('/post', postController);

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

module.exports = app; 
