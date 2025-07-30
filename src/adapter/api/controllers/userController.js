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
  sendContactEmailHandler,
  getOrderDetailHandler,
  getWishlistByUserHandler,
  sendMailHandler ,
  getDefaultAddressHandler,
  confirmEmailHandler,
  getAddressesByIdHandler,
  sendResetPassHandler,
  ResetPassHandler,
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
router.get('/addressesbyid/:addressid', getAddressesByIdHandler);
router.put('/addresses/:addressId', updateAddressHandler);
router.delete('/addresses/:addressId', deleteAddressHandler);
router.get('/profile/:userId', getUserProfileHandler);
router.get('/reviews/:userId', getReviewsByUserHandler);
router.post('/contact', sendContactEmailHandler);
router.get('/orders/:orderId', getOrderDetailHandler);
router.get('/wishlist/:userId', getWishlistByUserHandler);
router.post('/send', sendMailHandler);
router.get('/user_default_address/:userId', getDefaultAddressHandler);
router.post('/confirm-email', confirmEmailHandler);
router.post('/forget', sendResetPassHandler);
router.post('/reset-password', ResetPassHandler);

module.exports = router;
