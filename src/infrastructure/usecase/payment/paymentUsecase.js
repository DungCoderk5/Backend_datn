const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const productRepository = require("../../repository/productRepository");
const userRepository = require("../../repository/userRepository");
const { renderOrderEmail } = require("../../../utils/orderEmailTemplate");
const FRONTEND_URL = process.env.FRONTEND_URL;
const CALLBACK_URL = process.env.CALLBACK_URL;

// ✅ Map lưu app_trans_id ↔ order_id thực
const transIdMap = new Map();

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

module.exports = {
  createPayment: async ({ amount, order_data }) => {
    const transID = Math.floor(Math.random() * 1000000);

    const embed_data = {
      order_data,
      redirecturl: `${FRONTEND_URL}/checkout?payment=success`, // Không truyền orderId ở đây nữa
    };

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify([{}]),
      embed_data: JSON.stringify(embed_data),
      amount,
      description: `Thanh toán đơn hàng`,
      callback_url: `${CALLBACK_URL}/payment/callback`,
    };

    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const result = await axios.post(config.endpoint, null, { params: order });

    return {
      ...result.data,
      app_trans_id: order.app_trans_id,
    };
  },

  handleCallback: async (body) => {
    try {
      const dataStr = body.data;
      const reqMac = body.mac;
      const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

      if (reqMac !== mac) {
        return { return_code: -1, return_message: "mac not equal" };
      }

      const dataJson = JSON.parse(dataStr);

      const embedData = JSON.parse(dataJson.embed_data || "{}");
      const orderData = embedData.order_data;

      const status = await module.exports.checkStatus(dataJson.app_trans_id);

      if (status.return_code === 1) {
        // ép trạng thái thanh toán thành PAID
        const order = await productRepository.createOrder({
          ...orderData,
          payment_status: "PAID",
        });
        if (order.coupons_id) {
          await productRepository.increaseCouponUsedCount(order.coupons_id);
        }
        await productRepository.clearCart(order.user_id);
        transIdMap.set(dataJson.app_trans_id, order.orders_id);
        const redirectUrl = `${FRONTEND_URL}/checkout?payment=success&orderId=${order.orders_id}`;
        // 📩 Gửi email
        const fullOrder = await userRepository.getOrderDetailById(
          order.orders_id
        ); // Lấy full chi tiết để gửi
        const html = renderOrderEmail(fullOrder);
        if (fullOrder.user?.email) {
          // Lấy ngày & tháng từ thời điểm đặt hàng (created_at)
          const orderDate = moment(order.created_at);
          const day = orderDate.format("DD"); // Ngày
          const month = orderDate.format("MM"); // Tháng

          const customSubject = `Đơn hàng TERA${month}${day}${order.orders_id} của bạn đã đươc xác nhận`;

          await userRepository.sendMail({
            to: fullOrder.user.email,
            subject: customSubject,
            html,
          });
        }

        return {
          return_code: 1,
          return_message: "success",
          order_id: order.orders_id,
          redirect_url: redirectUrl,
        };
      }
      return { return_code: 2, return_message: "payment not completed" };
    } catch (err) {
      return { return_code: 0, return_message: err.message };
    }
  },

  checkStatus: async (app_trans_id) => {
    const postData = {
      app_id: config.app_id,
      app_trans_id,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const result = await axios({
      method: "post",
      url: "https://sb-openapi.zalopay.vn/v2/query",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify(postData),
    });

    const order_id = transIdMap.get(app_trans_id) || null;

    return {
      ...result.data,
      order_id,
    };
  },
};
