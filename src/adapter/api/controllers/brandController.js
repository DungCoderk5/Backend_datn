const express = require("express");
const router = express.Router();

const {
  getAllProductBrandHandler,
  addBrandHandler,
  updateBrandHandler,
  deleteBrandHandler,
  getBrandByIdHandler,
  updateBrandStatusHandler,
} = require("../../../application/brand/brandHttpHandler");
const { upload, validateRealImage } = require("../../middlewares/upload");
router.get("/", getAllProductBrandHandler);
router.post(
  "/",
  upload.single("logo_url"), // parse file và field text
  validateRealImage, // kiểm tra file ảnh hợp lệ
  addBrandHandler // xử lý lưu DB
);
router.put(
  "/update/:id",
  upload.single("logo_url"),
  validateRealImage,
  updateBrandHandler
);
router.get("/:id", getBrandByIdHandler);
router.patch("/:id/status", updateBrandStatusHandler);
router.delete("/delete/:id", deleteBrandHandler);

module.exports = router;
