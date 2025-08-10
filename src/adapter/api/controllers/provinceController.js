// src/controllers/provinceController.js
const express = require("express");
const {
  getAllProvincesHandler,
  getDistrictsHandler,
  getWardsHandler
} = require("../../../application/province/provinceHandler");

const router = express.Router();

router.get("/provinces", getAllProvincesHandler);

router.get("/provinces/:provinceCode/districts", getDistrictsHandler);

router.get("/districts/:districtCode/wards", getWardsHandler);

module.exports = router;
