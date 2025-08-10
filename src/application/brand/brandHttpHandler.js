const getAllProductBrandUsecase = require("../../infrastructure/usecase/brand/getAllProductBrandUsecase");
const createBrandUsecase = require("../../infrastructure/usecase/brand/createBrandUsecase");
const updateBrandUsecase = require("../../infrastructure/usecase/brand/updateBrandUsecase");
const deleteBrandUsecase = require("../../infrastructure/usecase/brand/deleteBrandUsecase");
const getBrandByIdUsecase = require("../../infrastructure/usecase/brand/getBrandByIdUsecase");
const getAllBrandsUsecase = require("../../infrastructure/usecase/brand/getAllBrandsUsecase");
const brandRepository = require("../../infrastructure/repository/brandRepository");
const productRepository = require("../../infrastructure/repository/productRepository"); 
const slugify = require("slugify");
// Handler
async function getAllProductBrandHandler(req, res) {
  try {
    const { id, name, status, page, limit, keyword, sortBy, sortOrder } =
      req.query;

    const result = await getAllProductBrandUsecase({
      id,
      name,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 5,
      keyword,
      sortBy: sortBy || "created_at",
      sortOrder: sortOrder || "desc",
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getAllProductBrand:", error);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ khi lấy thương hiệu sản phẩm." });
  }
}

async function deleteBrandHandler(req, res) {
  try {
    const brand_id = parseInt(req.params.id, 10);
    if (isNaN(brand_id)) {
      return res.status(400).json({ error: "ID thương hiệu không hợp lệ." });
    }

    // Kiểm tra xem brand có sản phẩm nào không
    const productCount = await productRepository.countByBrandId(brand_id);
    if (productCount > 0) {
      return res.status(400).json({
        error: "Không thể xóa thương hiệu vì còn sản phẩm liên quan.",
      });
    }

    const result = await deleteBrandUsecase(brand_id);
    res.status(200).json({ message: "Xóa thương hiệu thành công.", result });
  } catch (error) {
    console.error("[Handler] Lỗi deleteBrand:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi xóa thương hiệu sản phẩm." });
  }
}
async function getBrandByIdHandler(req, res) {
  try {
    const brand_id = parseInt(req.params.id, 10);
    if (isNaN(brand_id)) {
      return res.status(400).json({ error: "ID thương hiệu không hợp lệ." });
    }

    const brand = await getBrandByIdUsecase({ brand_id });
    if (!brand) {
      return res.status(404).json({ error: "Không tìm thấy thương hiệu." });
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error("[Handler] Lỗi getBrandById:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy thương hiệu." });
  }
}
async function updateBrandHandler(req, res) {
  try {
    const brand_id = Number(req.params.id);
    if (!brand_id) {
      return res.status(400).json({ error: "ID thương hiệu không hợp lệ" });
    }

    const { name, status } = req.body;
    let logo_url;

    if (req.file) {
      logo_url = req.file.filename;
    } else {
      // Lấy logo cũ từ DB nếu không upload mới
      const oldBrand = await brandRepository.findById(brand_id);
      logo_url = oldBrand?.logo_url || null;
    }

    if (!name) {
      throw new Error("Thiếu tên thương hiệu để cập nhật.");
    }

    const slug = slugify(name, { lower: true, strict: true, locale: "vi" });

    const result = await updateBrandUsecase({
      brand_id,
      name,
      slug,
      logo_url,
      status: Number(status),
    });

    res.status(200).json({ message: "Cập nhật thương hiệu thành công.", data: result });
  } catch (error) {
    console.error("[Handler] Lỗi updateBrand:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật thương hiệu sản phẩm." });
  }
}

async function updateBrandStatusHandler(req, res) {
  try {
    const brand_id = Number(req.params.id);
    if (!brand_id) {
      return res.status(400).json({ error: "ID thương hiệu không hợp lệ" });
    }

    const { status } = req.body;
    if (status === undefined) {
      return res.status(400).json({ error: "Thiếu trạng thái để cập nhật." });
    }

    const updatedBrand = await brandRepository.updateStatus(brand_id, Number(status));

    res.status(200).json({ message: "Cập nhật trạng thái thành công", data: updatedBrand });
  } catch (error) {
    console.error("[Handler] Lỗi updateBrandStatus:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật trạng thái thương hiệu." });
  }
}
async function addBrandHandler(req, res) {
  try {
    const { name, status } = req.body;
    const logo_url = req.file?.filename || null;

    if (!name) {
      return res.status(400).json({
        message: "Thiếu tên thương hiệu.",
      });
    }

    const slug = slugify(name, {
      lower: true, // viết thường
      strict: true, // bỏ ký tự đặc biệt
      locale: "vi", // hỗ trợ tiếng Việt
    });

    const result = await createBrandUsecase({
      name,
      slug,
      logo_url,
      status: Number(status), // ép sang số
    });

    return res.status(201).json({
      message: "Thêm thương hiệu thành công.",
      data: result,
    });
  } catch (error) {
    console.error("[Handler] Lỗi addBrand:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ khi thêm thương hiệu sản phẩm.",
      error: error.message,
    });
  }
}
async function getAllBrandsHandler(req, res) {
  try {
    const result = await getAllBrandsUsecase();
    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getAllBrands:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy tất cả thương hiệu." });
  }
}
module.exports = {
  getAllProductBrandHandler,
  addBrandHandler,
  updateBrandHandler,
  deleteBrandHandler,
  getBrandByIdHandler,
  updateBrandStatusHandler,
  getAllBrandsHandler,
};
