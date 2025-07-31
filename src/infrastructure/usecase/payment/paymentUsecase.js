const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");

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
    const embed_data = { redirecturl: `http://localhost:3001/thankyou/${order_id}` };

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
      callback_url: "https://your-ngrok-url.ngrok-free.app/callback",
    };

    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const result = await axios.post(config.endpoint, null, { params: order });
    return result.data;
  },

  handleCallback: async (body) => {
    const dataStr = body.data;
    const reqMac = body.mac;
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    if (reqMac !== mac) {
      return { return_code: -1, return_message: "mac not equal" };
    }

    const dataJson = JSON.parse(dataStr);
    console.log("Payment success. trans_id:", dataJson.app_trans_id);

    // Optional: Update đơn hàng trong DB tại đây

    return { return_code: 1, return_message: "success" };
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
