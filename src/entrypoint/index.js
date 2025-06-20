
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../adapter/api/controllers/userController');
const cors = require('cors');
const path = require("path")
const app = express();
app.use(express.json());

app.use(cors()); 
app.set('trust proxy', false);

app.use(bodyParser.json());

app.use('/', userController);

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

module.exports = app; 
