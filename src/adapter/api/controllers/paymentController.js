const express = require("express");
const router = express.Router();
const paymentHandler = require("../../../application/payment/paymentHandler");

router.post("/checkout", paymentHandler.checkout);
router.post("/callback", paymentHandler.callback);
router.post("/order-status/:app_trans_id", paymentHandler.checkStatus);

module.exports = router;
