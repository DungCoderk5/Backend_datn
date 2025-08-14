const express = require("express");
const router = express.Router();

const {
  getAllCouponsHandler,
  createCouponHandler,
  updateCouponHandler,
  getCouponByIdHandler,
} = require("../../../application/voucher/voucherHttpHandler");

router.get("/", getAllCouponsHandler);
router.post("/", createCouponHandler);
router.put("/update/:id", updateCouponHandler);  // Thêm route update theo id
router.get("/:id", getCouponByIdHandler);

module.exports = router;
