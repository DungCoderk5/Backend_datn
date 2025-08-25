require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../adapter/api/controllers/userController");

const productController = require("../adapter/api/controllers/productController");
const categoryController = require("../adapter/api/controllers/categoryController");
const postController = require("../adapter/api/controllers/postController");
const dashboarController = require("../adapter/api/controllers/dashboarController");
const brandController = require("../adapter/api/controllers/brandController");
const provinceController = require("../adapter/api/controllers/provinceController");
const paymentController = require("../adapter/api/controllers/paymentController");
<<<<<<< Updated upstream
const voucherController = require('../adapter/api/controllers/voucherController');
const cookieParser = require("cookie-parser"); 
const cors = require('cors');
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: 'http://localhost:3001',  
  credentials: true                
}));
app.set('trust proxy', false);
=======
const voucherController = require("../adapter/api/controllers/voucherController");
const chatAIController = require("../adapter/api/controllers/chatAIController");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: `${FRONTEND_URL}`,
    credentials: true,
  })
);
app.set("trust proxy", false);
>>>>>>> Stashed changes
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", userController);

app.use("/product", productController);

app.use("/category", categoryController);

app.use("/post", postController);

app.use("/dashboard", dashboarController);

app.use("/brand", brandController);

app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.use("/payment", paymentController);

app.use("/province", provinceController);

<<<<<<< Updated upstream
app.use('/voucher', voucherController)
=======
app.use("/voucher", voucherController);
app.use("/chatAI", chatAIController);
>>>>>>> Stashed changes

module.exports = app;
