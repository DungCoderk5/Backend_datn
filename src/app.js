const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());  // Đọc cookie từ request

app.use(cors());

module.exports = app;