const checkoutUsecase = require("../../infrastructure/usecase/product/checkoutUsecase");
const paymentUsecase = require("../../infrastructure/usecase/payment/paymentUsecase");
const {
  prepareOrder,
} = require("../../infrastructure/usecase/product/checkoutUsecase");
const productRepository = require("../../infrastructure/repository/productRepository");

module.exports = {
  checkout: async (req, res) => {
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

      // ✅ CHỈ chuẩn bị dữ liệu (tạm) rồi truyền sang embed_data
      const orderData = await checkoutUsecase.prepareOrderData({
        user_id,
        shipping_address_id,
        payment_method,
        coupon_code,
        shipping_fee,
        comment,
      });

      if (payment_method.code === "zalopay") {
        const payment = await paymentUsecase.createPayment({
          amount: orderData.total_price,
          order_data: orderData, // ❗ Truyền dữ liệu tạm vào embed_data
        });

        return res.status(200).json({
          message: "Đã tạo yêu cầu thanh toán",
          payment,
        });
      }

      // 👉 B3: Nếu là COD thì tạo đơn hàng luôn
      const order = await productRepository.createOrder(orderData);
      await productRepository.clearCart(user_id);

      return res.status(201).json({
        message: "Tạo đơn hàng thành công (COD)",
        order,
      });
    } catch (err) {
      console.error("Checkout Error:", err);
      return res.status(500).json({ error: "Lỗi khi thanh toán đơn hàng" });
    }
  },

  callback: async (req, res) => {
    try {
      const result = await paymentUsecase.handleCallback(req.body);
      res.json(result);
    } catch (err) {
      res.json({ return_code: 0, return_message: err.message });
    }
  },

  checkStatus: async (req, res) => {
    try {
      const result = await paymentUsecase.checkStatus(req.params.app_trans_id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to check order status" });
    }
  },
};
