// src/usecases/provinceUsecase.js

async function getAllProvincesUsecase() {
  const res = await fetch(`https://provinces.open-api.vn/api/p/`);
  if (!res.ok) throw new Error("Không thể lấy danh sách tỉnh/thành");
  return await res.json();
}

async function getDistrictsByProvinceUsecase(code) {
  console.log("Fetch districts for province code:", code);
  const res = await fetch(
    `https://provinces.open-api.vn/api/p/${code}?depth=2`
  );
  if (!res.ok) {
    const errText = await res.text();
    console.error("API Error response:", res.status, errText);
    throw new Error("Không thể lấy quận/huyện");
  }
  const data = await res.json();
  return data.districts || [];
}

async function getWardsByDistrictUsecase(code) {
  const res = await fetch(
    `https://provinces.open-api.vn/api/d/${code}?depth=2`
  );
  if (!res.ok) throw new Error("Không thể lấy xã/phường");
  const data = await res.json();
  return data.wards || [];
}

module.exports = {
  getAllProvincesUsecase,
  getDistrictsByProvinceUsecase,
  getWardsByDistrictUsecase,
};
