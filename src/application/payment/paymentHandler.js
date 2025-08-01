const checkoutUsecase = require("../../infrastructure/usecase/product/checkoutUsecase");
const paymentUsecase = require("../../infrastructure/usecase/payment/paymentUsecase");

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

      // B1: Tạo đơn hàng trước
      const order = await checkoutUsecase({
        user_id,
        shipping_address_id,
        payment_method,
        coupon_code,
        shipping_fee,
        comment,
      });

      // B2: Nếu là thanh toán online → tạo link ZaloPay
      if (payment_method.code === "zalopay") {
        const payment = await paymentUsecase.createPayment({
          amount: order.total_amount,
          order_id: order.orders_id,
        });

        return res.status(200).json({
          message: "Đã tạo đơn hàng và yêu cầu thanh toán",
          order,
          payment,
        });
      }

      // B3: Nếu là COD hoặc offline
      return res.status(201).json({
        message: "Tạo đơn hàng thành công",
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
