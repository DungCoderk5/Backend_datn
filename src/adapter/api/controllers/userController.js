const express = require("express");
const router = express.Router();
const {
  loginHandler,
  logoutHandler,
  registerHandler,
  updateUserHandler,
  addAddressHandler,
  checkTokenHandler,
  googleCallback
} = require("../../../application/user/userHttpHandler");

router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.post("/register", registerHandler);
router.put("/update", updateUserHandler);
router.post("/add-address", addAddressHandler);
router.get("/check-token", checkTokenHandler);
router.post("/google/callback",googleCallback);

module.exports = router;
