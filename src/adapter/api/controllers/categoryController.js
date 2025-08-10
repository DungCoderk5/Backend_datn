const express = require("express");
const router = express.Router();

const {
  getAllProductCategoriesHandler,
  addCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  getCategoryByIdHandler,
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
router.get("/:id", getCategoryByIdHandler);
router.delete("/delete/:id", deleteCategoryHandler);

module.exports = router;
