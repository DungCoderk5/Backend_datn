const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const productRepository = require("../../repository/productRepository");

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

module.exports = {
  createPayment: async ({ amount, order_id }) => {
    const transID = Math.floor(Math.random() * 1000000);
    const items = [{}];
    const embed_data = {
      redirecturl: `http://localhost:3001/checkout?payment=success&orderId=${order_id}`,
      order_id,
    };

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      description: `Thanh toán đơn hàng #${order_id}`,
      bank_code: "",
      callback_url: "https://e6917f72db00.ngrok-free.app/payment/callback",
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
      console.log("🔔 [ZaloPay Callback Triggered]", body);

      const dataStr = body.data;
      const reqMac = body.mac;
      const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

      if (reqMac !== mac) {
        console.error("❌ MAC mismatch");
        return { return_code: -1, return_message: "mac not equal" };
      }

      const dataJson = JSON.parse(dataStr);
      console.log("✅ Parsed dataJson:", dataJson);

      const embedData = JSON.parse(dataJson.embed_data || "{}");
      const orderId = Number(embedData?.order_id);
      console.log("🧾 Extracted orderId:", orderId);

      const status = await module.exports.checkStatus(dataJson.app_trans_id);
      console.log("🔎 Payment status from ZaloPay:", status);

      if (status.return_code === 1) {
        console.log("✅ Payment success. Proceeding...");

        await productRepository.updatePaymentStatus(orderId, "paid");

        const order = await productRepository.getOrderById(orderId);
        console.log("📦 Retrieved order:", order);

        if (order?.user_id) {
          console.log("🧹 Clearing cart for user:", order.user_id);
          await productRepository.clearCart(order.user_id);
        } else {
          console.warn("⚠️ Không tìm thấy user_id trong đơn hàng");
        }

        return { return_code: 1, return_message: "success" };
      }

      return { return_code: 2, return_message: "payment not completed" };
    } catch (err) {
      console.error("💥 Error in handleCallback:", err);
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

    return result.data;
  },
};
