const express = require("express");
const router = express.Router();
const { upload, validateRealImage } = require("../../middlewares/upload");
const {
  loginHandler,
  logoutHandler,
  registerHandler,
  updateUserHandler,
  addAddressHandler,
  checkTokenHandler,
  googleCallback,
  changePasswordHandler,
  getCartByUserHandler,
  getAddressesByUserHandler,
  updateAddressHandler,
  deleteAddressHandler,
  getUserProfileHandler,
  getReviewsByUserHandler,
} = require("../../../application/user/userHttpHandler");

router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.post("/register", registerHandler);
router.put("/update" , upload.single('avatar'), validateRealImage, updateUserHandler);
router.post("/add-address", addAddressHandler);
router.get("/check-token", checkTokenHandler);
router.post("/google/callback",googleCallback);
router.put("/change-pass", changePasswordHandler);
router.get('/get-cart/:userId', getCartByUserHandler);
router.get('/addresses/:userId', getAddressesByUserHandler);
router.put('/addresses/:addressId', updateAddressHandler);
router.delete('/addresses/:addressId', deleteAddressHandler);
router.get('/profile/:userId', getUserProfileHandler);
router.get('/reviews/:userId', getReviewsByUserHandler);
module.exports = router;
