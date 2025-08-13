const getAllProductsUsecase = require("../../infrastructure/usecase/product/getAllProductUsecase");
const getProductDetailUsecase = require("../../infrastructure/usecase/product/getProductDetailUsecase");
const getBestSellingUsecase = require("../../infrastructure/usecase/product/getBestSellingUsecase");
const getNewestProductsUsecase = require("../../infrastructure/usecase/product/getNewestProductsUsecase");
const getFeaturedProductsUsecase = require("../../infrastructure/usecase/product/getFeaturedProductsUsecase");
const getProductsByCategoryUsecase = require("../../infrastructure/usecase/product/getProductsByCategoryUsecase");
const getDealProductsUsecase = require("../../infrastructure/usecase/product/getDealProductsUsecase");
const getRelatedProductsUsecase = require("../../infrastructure/usecase/product/getRelatedProductsUsecase");
const getProductsByGenderUsecase = require("../../infrastructure/usecase/product/getProductsByGenderUsecase");
const addProductUsecase = require("../../infrastructure/usecase/product/addProductUsecase");
const addToCartUsecase = require("../../infrastructure/usecase/product/addToCartUsecase");
const searchProductsUsecase = require("../../infrastructure/usecase/product/searchProductsUsecase");
const getAllCouponsUsecase = require("../../infrastructure/usecase/product/getAllCouponsUsecase");
const addToWishlistUsecase = require("../../infrastructure/usecase/product/addToWishlistUsecase");
const getReviewsByProductUsecase = require("../../infrastructure/usecase/product/getReviewsByProductUsecase");
const createProductReviewUsecase = require("../../infrastructure/usecase/product/createProductReviewUsecase");
const getProductsByBrandUsecase = require("../../infrastructure/usecase/product/getProductsByBrandUsecase");
const addToCompareUsecase = require("../../infrastructure/usecase/product/addToCompareUsecase");
const removeFromCompareUsecase = require("../../infrastructure/usecase/product/removeFromCompareUsecase");
const getCompareProductsUsecase = require("../../infrastructure/usecase/product/getCompareProductsUsecase");
const getCartUsecase = require("../../infrastructure/usecase/product/getCartUsecase");
const updateCartUsecase = require("../../infrastructure/usecase/product/updateCartUsecase");
const removeFromCartUsecase = require("../../infrastructure/usecase/product/removeFromCartUsecase");
const checkoutUsecase = require("../../infrastructure/usecase/product/checkoutUsecase");
const filterProductsUsecase = require("../../infrastructure/usecase/product/filterProductsUsecase");
const removeWishlistItemUsecase = require("../../infrastructure/usecase/product/removeWishlistItemUsecase");
const getOrdersByUserUsecase = require("../../infrastructure/usecase/product/getOrdersByUserUsecase");
const updateProductUsecase = require("../../infrastructure/usecase/product/updateProductUsecase");
const deleteProductUsecase = require("../../infrastructure/usecase/product/deleteProductUsecase");
const getCouponsUsecase = require("../../infrastructure/usecase/product/getCouponsUsecase");
const getUserVouchersUsecase = require("../../infrastructure/usecase/product/getUserVouchersUsecase");
const getAllProductReviewUsecase = require("../../infrastructure/usecase/product/getAllProductReviewUseCase");
const getByIdReviewUsecase = require("../../infrastructure/usecase/product/getByIdReviewUseCase");
const getStatusReviewUsecase = require('../../infrastructure/usecase/product/getStatusReviewUsecase');

async function getAllProductsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getAllProductsUsecase({ page, limit });

    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getAllProducts:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy danh sách sản phẩm." });
  }
}

async function getCouponsHandler(req, res) {
  const { code, total } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Thiếu mã giảm giá." });
  }
  if (total && isNaN(total)) {
    return res
      .status(400)
      .json({ error: "Bạn cần thêm sản phẩm trước khi áp dụng mã giảm giá ." });
  }
  try {
    const coupons = await getCouponsUsecase(code, total);
    res.status(200).json(coupons);
  } catch (error) {
    console.error("[Handler] Lỗi getAllCoupons:", error);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ khi lấy danh sách mã giảm giá." });
  }
}
async function getUserVouchersHandler(req, res) {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Thiếu hoặc sai userId." });
  }

  try {
    const vouchers = await getUserVouchersUsecase(userId, page, limit);
    res.status(200).json({
      data: vouchers,
      pagination: {
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("[Handler] Lỗi getUserVouchers:", error);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ khi lấy danh sách voucher người dùng." });
  }
}

async function getOrderHandler(req, res) {
  const userId = parseInt(req.params.userId);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  try {
    const orders = await getOrdersByUserUsecase({ userId, skip, take: limit });

    return res.status(200).json({
      data: orders,
    });
  } catch (error) {
    console.error("[Handler] Lỗi lấy đơn hàng theo user:", error);
    return res.status(500).json({ error: "Lỗi máy chủ khi lấy đơn hàng." });
  }
}

async function deleteProductHandler(req, res) {
  try {
    const products_id = parseInt(req.params.id);
    if (isNaN(products_id)) {
      return res.status(400).json({ error: "ID sản phẩm không hợp lệ." });
    }
    const result = await deleteProductUsecase(products_id);
    res.status(200).json({ message: "Xóa sản phẩm thành công.", result });
  } catch (error) {
    console.error("[Handler] Lỗi deleteProduct:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi xóa sản phẩm." });
  }
}

async function filterProductsHandler(req, res, next) {
  try {
    const {
      keyword,
      gender,
      brand,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await filterProductsUsecase({
      keyword,
      gender,
      brand,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
      sortBy,
      sortOrder,
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getCompareProductsHandler(req, res) {
  const user_id = parseInt(req.query.user_id);

  if (!user_id) {
    return res.status(400).json({ error: "Thiếu user_id trong" });
  }

  const result = await getCompareProductsUsecase(user_id);

  if (result?.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(200).json(result);
}

async function getCartHandler(req, res) {
  try {
    const user_id = req.user?.id || req.query.user_id;
    if (!user_id) return res.status(400).json({ error: "Thiếu user_id" });

    const cart = await getCartUsecase(user_id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCartHandler(req, res) {
  try {
    const { user_id, variant_id, quantity } = req.body;

    if (!user_id || !variant_id || quantity === undefined) {
      return res
        .status(400)
        .json({ error: "Thiếu thông tin cập nhật giỏ hàng" });
    }

    const result = await updateCartUsecase({ user_id, variant_id, quantity });
    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cập nhật giỏ hàng" });
  }
}

async function getProductDetailHandler(req, res) {
  try {
    const { id } = req.params;
    const { slug } = req.query;

    const identifier = {};
    if (id) identifier.id = Number(id);
    if (slug) identifier.slug = slug;

    const product = await getProductDetailUsecase(identifier);
    res.status(200).json(product);
  } catch (error) {
    console.error("[Handler] Lỗi getProductDetail:", error.message);
    res.status(404).json({ error: error.message });
  }
}

async function getBestSellingHandler(req, res) {
  try {
    const top = parseInt(req.query.top) || 6;

    const result = await getBestSellingUsecase(top);

    res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi lấy sản phẩm bán chạy:", err);
    res.status(500).json({ error: "Server Error" });
  }
}

async function getNewestProductsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getNewestProductsUsecase({ page, limit });

    res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi lấy sản phẩm mới nhất:", err);
    res.status(500).json({ error: "Server Error" });
  }
}

async function getFeaturedProductsHandler(req, res) {
  try {
    const result = await getFeaturedProductsUsecase();
    res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm nổi bật:", err);
    res.status(500).json({ error: "Server Error" });
  }
}

async function getProductsByCategoryHandler(req, res) {
  try {
    const categoryName = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!categoryName) {
      return res.status(400).json({ error: "Missing category name or slug" });
    }

    const result = await getProductsByCategoryUsecase({
      categoryName,
      page,
      limit,
    });

    res.json({
      products: result.products,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getDealProductsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || "asc"; // "asc" hoặc "desc"

    const result = await getDealProductsUsecase({ page, limit, sort });

    res.json({
      products: result.products,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm đang giảm giá:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getRelatedProductsHandler(req, res) {
  try {
    const productId = parseInt(req.params.productId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const result = await getRelatedProductsUsecase({ productId, page, limit });

    res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi getRelatedProducts:", err);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm cùng loại." });
  }
}

async function getProductsByGenderHandler(req, res) {
  try {
    const genderName = req.query.gender;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!genderName) {
      return res.status(400).json({ error: "Missing gender query" });
    }

    const result = await getProductsByGenderUsecase({
      genderName,
      page,
      limit,
    });

    res.json({
      products: result.products,
      total: result.total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo giới tính:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function addProductHandler(req, res) {
  try {
    const data = req.body;
    const create = await addProductUsecase(data);
    res
      .status(200)
      .json({ message: "tạo sản phẩm thành công", product: create });
  } catch (error) {
    console.error("Lỗi khi lấy thêm sản phẩm:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateProductHandler = async (req, res) => {
  try {
    const products_id = parseInt(req.params.id);
    const data = req.body;

    if (!products_id || !data) {
      return res.status(400).json({ error: "Thiếu dữ liệu cập nhật." });
    }

    const result = await updateProductUsecase({ products_id, data });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message);
    return res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi cập nhật sản phẩm." });
  }
};

async function addToCart(req, res) {
  try {
    const data = req.body;
    const cart = await addToCartUsecase(data);
    res
      .status(200)
      .json({ message: "thêm sản phẩm vào giỏ hàng thành công", cart: cart });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function searchProductsHandler(req, res) {
  try {
    const keyword = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await searchProductsUsecase({ keyword, page, limit });
    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi searchProducts:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi tìm kiếm sản phẩm." });
  }
}

async function getAllCouponsHandler(req, res) {
  try {
    const result = await getAllCouponsUsecase();
    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getAllCoupons:", error);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ khi lấy danh sách mã giảm giá." });
  }
}

async function addToWishlistHandler(req, res) {
  try {
    const { user_id, product_id } = req.body;

    const result = await addToWishlistUsecase({ user_id, product_id });
    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi addToWishlist:", error);
    res.status(500).json({
      error: "Lỗi máy chủ khi thêm sản phẩm vào danh sách yêu thích.",
    });
  }
}

async function getReviewsByProductHandler(req, res) {
  try {
    const productId = parseInt(req.params.productId);
    const result = await getReviewsByProductUsecase({ productId });
    res.status(200).json(result);
  } catch (error) {
    console.error("[Handler] Lỗi getReviewsByProduct:", error);
    res.status(500).json({ error: "Lỗi khi lấy đánh giá theo sản phẩm." });
  }
}

async function createProductReviewHandler(req, res) {
  try {
    const product_id = parseInt(req.params.productId);
    const { user_id, rating, content } = req.body;

    if (!user_id || !rating || !product_id) {
      return res.status(400).json({ error: "Thiếu thông tin đánh giá." });
    }

    const review = await createProductReviewUsecase({
      user_id,
      product_id,
      rating,
      content,
      status:"approved"
    });
    res.status(201).json(review);
  } catch (err) {
    console.error("[Handler] Lỗi createProductReview:", err);

    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Bạn đã đánh giá sản phẩm này rồi." });
    }

    res.status(500).json({ error: "Lỗi khi gửi đánh giá." });
  }
}

async function getProductsByBrandHandler(req, res) {
  try {
    const brandId = parseInt(req.params.brandId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getProductsByBrandUsecase({ brandId, page, limit });
    res.status(200).json(result);
  } catch (err) {
    console.error("[Handler] Lỗi getProductsByBrand:", err);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm theo nhãn hàng." });
  }
}

async function addToCompareHandler(req, res) {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: "Thiếu user_id hoặc product_id" });
    }

    const result = await addToCompareUsecase({ user_id, product_id });

    return res.status(200).json({
      message: "Đã thêm sản phẩm vào danh sách so sánh",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function removeFromCompareHandler(req, res) {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: "Thiếu user_id hoặc product_id" });
    }

    const result = await removeFromCompareUsecase({ user_id, product_id });

    return res.status(200).json({
      message: "Đã xóa sản phẩm khỏi danh sách so sánh",
      data: result,
    });
  } catch (error) {
    console.error("[Handler] Lỗi removeFromCompare:", error);
    return res
      .status(500)
      .json({ error: "Lỗi khi xóa sản phẩm khỏi danh sách so sánh." });
  }
}

async function removeFromCartHandler(req, res) {
  try {
    const { user_id, variant_id } = req.body;

    if (!user_id || !variant_id) {
      return res.status(400).json({ error: "Thiếu user_id hoặc variant_id" });
    }

    const result = await removeFromCartUsecase({ user_id, variant_id });

    return res.json({ message: "Đã xóa khỏi giỏ hàng", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm khỏi giỏ hàng" });
  }
}

async function checkoutHandler(req, res) {
  try {
    const {
      user_id,
      shipping_address_id,
      payment_method,
      coupon_code,
      shipping_fee,
      comment,
    } = req.body;

    if (!user_id || !shipping_address_id || !payment_method) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const order = await checkoutUsecase({
      user_id,
      shipping_address_id,
      payment_method,
      coupon_code,
      shipping_fee: shipping_fee || 0,
      comment,
    });

    return res
      .status(201)
      .json({ message: "Thanh toán thành công", data: order });
  } catch (err) {
    console.error("Checkout Error:", err);
    return res.status(500).json({ error: "Lỗi khi thanh toán đơn hàng" });
  }
}

async function removeWishlistItemHandler(req, res) {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: "Thiếu userId hoặc productId." });
  }

  try {
    const result = await removeWishlistItemUsecase(
      parseInt(userId),
      parseInt(productId)
    );

    if (result === null) {
      return res.status(404).json({ message: "Mục yêu thích không tồn tại." });
    }

    return res.status(200).json({ message: "Đã xóa sản phẩm khỏi wishlist." });
  } catch (error) {
    console.error("[Handler] Lỗi xóa sản phẩm khỏi wishlist:", error);
    return res.status(500).json({ error: "Lỗi máy chủ." });
  }
}
async function getAllProductReviewHandler(req, res) {
  try {
    // Lấy query params từ request
    const {
      page,
      limit,
      product_reviews_id,
      user_name,
      product_name,
      rating,
      search,
      sortBy,
      sortOrder,
    } = req.query;

    // Gọi usecase
    const result = await getAllProductReviewUsecase({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      product_reviews_id,
      user_name,
      product_name,
      rating,
      search,
      sortBy,
      sortOrder,
    });

    // Trả về dữ liệu
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đánh giá sản phẩm thành công",
      ...result,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá sản phẩm:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
}
async function getByIdReviewHandler(req, res) {
  try {
    // Lấy id từ params
    const product_reviews_id = parseInt(req.params.id);
    if (!product_reviews_id)
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    // Gọi usecase
    const result = await getByIdReviewUsecase(product_reviews_id);
    // Trả về dữ liệu
    return res.status(200).json({
      success: true,
      message: "Lấy đánh giá sản phẩm thành công",
      ...result,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá sản phẩm:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
}

async function getStatusReviewHandler(req, res) {
  try {
    const product_reviews_id = parseInt(req.params.id);
    if (!product_reviews_id) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Thiếu trạng thái đánh giá.' });
    }

    const updatedReview = await getStatusReviewUsecase(product_reviews_id, status);

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: updatedReview
    });

  } catch (err) {
    console.error('[Handler] Lỗi updateReviewStatus:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái đánh giá.' });
  }
}
module.exports = {
  getAllProductsHandler,
  getProductDetailHandler,
  getBestSellingHandler,
  getNewestProductsHandler,
  getFeaturedProductsHandler,
  getProductsByCategoryHandler,
  getDealProductsHandler,
  getRelatedProductsHandler,
  getProductsByGenderHandler,
  addProductHandler,
  addToCart,
  searchProductsHandler,
  getAllCouponsHandler,
  addToWishlistHandler,
  getReviewsByProductHandler,
  createProductReviewHandler,
  getProductsByBrandHandler,
  addToCompareHandler,
  removeFromCompareHandler,
  getCompareProductsHandler,
  getCartHandler,
  updateCartHandler,
  removeFromCartHandler,
  checkoutHandler,
  filterProductsHandler,
  removeWishlistItemHandler,
  getOrderHandler,
  updateProductHandler,
  deleteProductHandler,
  getCouponsHandler,
  getUserVouchersHandler,
  getAllProductReviewHandler,
  getByIdReviewHandler,
  getStatusReviewHandler
};
