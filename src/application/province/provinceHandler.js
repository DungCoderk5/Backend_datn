
const {
  getAllProvincesUsecase,
  getDistrictsByProvinceUsecase,
  getWardsByDistrictUsecase
} = require("../../infrastructure/usecase/province/provinceUsecase");

async function getAllProvincesHandler(req, res) {
  try {
    const provinces = await getAllProvincesUsecase();
    res.status(200).json(provinces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDistrictsHandler(req, res) {
  try {
    const { provinceCode } = req.params;
    if (!provinceCode) throw new Error("Thiếu mã tỉnh");
    const districts = await getDistrictsByProvinceUsecase(provinceCode);
    res.status(200).json(districts);
  } catch (err) {
    console.error("Lỗi getDistrictsHandler:", err);
    res.status(500).json({ error: err.message || "Không thể lấy quận/huyện" });
  }
}

async function getWardsHandler(req, res) {
  try {
    const { districtCode } = req.params; // lấy từ params
    if (!districtCode) throw new Error("Thiếu mã quận");
    const wards = await getWardsByDistrictUsecase(districtCode);
    res.status(200).json(wards);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


module.exports = {
  getAllProvincesHandler,
  getDistrictsHandler,
  getWardsHandler
};
