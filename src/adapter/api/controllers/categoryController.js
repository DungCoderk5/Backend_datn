const express = require("express");
const router = express.Router();

const {
  getAllProductCategoriesHandler,
  addCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} = require("../../../application/category/categoryHttpHandler");
const { upload, validateRealImage } = require("../../middlewares/upload");
router.get("/", getAllProductCategoriesHandler);
router.post(
  "/",
  upload.single("image"), // parse file và field text
  validateRealImage,
  addCategoryHandler
);
router.put("/update/:id", updateCategoryHandler);
router.delete("/delete/:id", deleteCategoryHandler);

module.exports = router;
