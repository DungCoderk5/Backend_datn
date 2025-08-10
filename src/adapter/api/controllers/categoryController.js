const express = require("express");
const router = express.Router();

const {
  getAllProductCategoriesHandler,
  addCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  getCategoryByIdHandler,
  updateCategoryStatusHandler,
  getAllCategoriesHandler,
} = require("../../../application/category/categoryHttpHandler");
const { upload, validateRealImage } = require("../../middlewares/upload");
router.get("/", getAllProductCategoriesHandler);
router.post(
  "/",
  upload.single("image"), // parse file và field text
  validateRealImage,
  addCategoryHandler
);
router.put(
  "/update/:id",
  upload.single("image"),
  validateRealImage,
  updateCategoryHandler
);
router.patch("/:id/status", updateCategoryStatusHandler);
router.get("/all", getAllCategoriesHandler);
router.delete("/delete/:id", deleteCategoryHandler);
router.get("/:id", getCategoryByIdHandler);

module.exports = router;
