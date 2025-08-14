const getAllCouponsUsecase = require("../../infrastructure/usecase/voucher/getAllCouponsUsecase");
const createCouponUsecase = require("../../infrastructure/usecase/voucher/createCouponUsecase");
const couponRepository = require("../../infrastructure/repository/couponRepository");
const updateCouponUsecase = require("../../infrastructure/usecase/voucher/updateCouponUsecase"); // đường dẫn đúng với bạn

async function getAllCouponsHandler(req, res) {
  try {
    const {
      id,
      code,
      status,
      page,
      limit,
      keyword,
      sortBy,
      sortOrder,
      discount_type,
      start_date,
      end_date,
      usage_limit,
      used_count,
      min_order,
    } = req.query;

    const result = await getAllCouponsUsecase({
      id,
      code,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 5,
      keyword,
      sortBy: sortBy || "code",
      sortOrder: sortOrder || "asc",
      discount_type,
      start_date,
      end_date,
      usage_limit: usage_limit ? Number(usage_limit) : undefined,
      used_count: used_count ? Number(used_count) : undefined,
      min_order: min_order ? Number(min_order) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getAllCoupons:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy mã giảm giá." });
  }
}

async function createCouponHandler(req, res) {
  try {
    const data = req.body;

    if (
      !data.code ||
      !data.discount_type ||
      typeof data.discount_value === 'undefined'
    ) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    // Kiểm tra mã code đã tồn tại chưa
    const existing = await couponRepository.findAll({ code: data.code, limit: 1 });
    if (existing.data.length > 0) {
      return res.status(400).json({ error: "Mã code đã tồn tại, vui lòng chọn mã khác." });
    }

    const newCoupon = await createCouponUsecase(data);

    res.status(201).json(newCoupon);
  } catch (error) {
    console.error("[Handler] Lỗi tạo mã giảm giá:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Mã code bị trùng." });
    }
    res.status(500).json({ error: "Lỗi máy chủ khi tạo mã giảm giá." });
  }
}
async function updateCouponHandler(req, res) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID không hợp lệ." });
    }

    const data = req.body;

    // Kiểm tra các trường bắt buộc nếu cần (ví dụ code, discount_type, discount_value)
    if (!data.code || !data.discount_type || typeof data.discount_value === "undefined") {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    // Kiểm tra mã code đã tồn tại với voucher khác chưa
    const existing = await couponRepository.findAll({ code: data.code, limit: 1 });
    if (existing.data.length > 0 && existing.data[0].coupons_id !== id) {
      return res.status(400).json({ error: "Mã code đã tồn tại, vui lòng chọn mã khác." });
    }

    // Gọi update usecase
    const updatedCoupon = await updateCouponUsecase(id, data);

    if (!updatedCoupon) {
      return res.status(404).json({ error: "Mã giảm giá không tồn tại." });
    }

    res.json(updatedCoupon);
  } catch (error) {
    console.error("[Handler] Lỗi cập nhật mã giảm giá:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Mã code bị trùng." });
    }
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật mã giảm giá." });
  }
}
async function getCouponByIdHandler(req, res) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID không hợp lệ." });
    }
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
      return res.status(404).json({ error: "Không tìm thấy mã giảm giá." });
    }
    res.json(coupon);
  } catch (error) {
    console.error("[Handler] Lỗi lấy mã giảm giá:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy mã giảm giá." });
  }
}

module.exports = {
  getAllCouponsHandler,
  createCouponHandler,
  updateCouponHandler,
  getCouponByIdHandler,
};
