require("dotenv").config();
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function renderOrderEmail(order) {
  const currency = (amount) => `${amount.toLocaleString()}₫`;

  const subtotal = order.order_items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (order.coupon) {
    if (order.coupon.discount_type === "percentage") {
      discountAmount = Math.floor(
        (subtotal * order.coupon.discount_value) / 100
      );
    } else if (order.coupon.discount_type === "fixed") {
      discountAmount = order.coupon.discount_value;
    }
  }

  const shippingFee = order.shipping_fee || 0;
  const totalAmount = subtotal - discountAmount + shippingFee;

  const rows = order.order_items
    .map((item) => {
      const product = item.variant.product;
      const img = item.variant.color?.images
        ? `${BASE_URL}/${item.variant.color.images}`
        : "https://via.placeholder.com/60";

      const color = item.variant.color?.name_color || "Không rõ";
      const size = item.variant.size?.number_size || "Không rõ";
      const lineTotal = item.unit_price * item.quantity;

      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px; display: flex; align-items: center; flex-wrap: wrap;">
            <img src="${img}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px; border-radius: 8px;" />
            <div style="flex: 1; min-width: 150px;">
              <div style="font-weight: bold;">${product.name}</div>
              <div style="font-size: 12px; color: #666;">Màu: ${color}, Size: ${size}</div>
              <div style="font-size: 13px; margin-top: 4px;">SL: ${item.quantity} × ${currency(item.unit_price)}</div>
            </div>
            <div style="margin-left: auto; font-weight: bold;">${currency(lineTotal)}</div>
          </td>
        </tr>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      @media only screen and (max-width: 600px) {
        table[class="responsive-table"] {
          width: 100% !important;
        }
        td[class="responsive-td"] {
          display: block !important;
          width: 100% !important;
          text-align: left !important;
        }
      }
    </style>
  </head>
  <body>
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; border: 1px solid #ddd; color: #333;">
    <h2 style="color: #2E86C1;">
      Xác nhận đơn hàng TERA${new Date(order.created_at).toISOString().slice(5, 10).replace("-", "")}${order.orders_id}
    </h2>

    <p>Xin chào <strong>${order.user?.name || "Khách hàng"}</strong>,</p>
    <p>Cảm ơn bạn đã mua hàng tại <strong>Tera Shoes</strong>. Chúng tôi đã nhận được đơn hàng của bạn với thông tin sau:</p>

    <h3 style="color: #2E86C1;">Chi tiết sản phẩm</h3>
    <table class="responsive-table" style="width: 100%; border-collapse: collapse;">
      <tbody>
        ${rows}
      </tbody>
    </table>

    <h3 style="color: #2E86C1; margin-top: 20px;">Thông tin giao hàng</h3>
    <p><strong>Người nhận:</strong> ${order.user?.name || ""}</p>
    <p><strong>Địa chỉ:</strong> ${order.shipping_address?.address_line || "Không rõ"}</p>
    <p><strong>Phương thức thanh toán:</strong> ${order.payment_method?.name_method || "Không rõ"}</p>

    <h3 style="color: #2E86C1; margin-top: 20px;">Tóm tắt đơn hàng</h3>
    <table style="width: 100%; font-size: 15px;">
      <tr>
        <td>Tạm tính:</td>
        <td style="text-align: right;">${currency(subtotal)}</td>
      </tr>
      ${
        order.coupon
          ? `<tr>
              <td>Giảm giá (${order.coupon.code}):</td>
              <td style="text-align: right;">– ${currency(discountAmount)}</td>
            </tr>`
          : ""
      }
      <tr>
        <td>Phí vận chuyển:</td>
        <td style="text-align: right;">${currency(shippingFee)}</td>
      </tr>
      <tr style="font-weight: bold; font-size: 16px;">
        <td>Tổng thanh toán:</td>
        <td style="text-align: right; color: #d32f2f;">${currency(totalAmount)}</td>
      </tr>
    </table>

   <p style="margin-top: 30px; font-size:14px; text-align:center; color:#444; line-height:1.6;">
  Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.
</p>

<div style="margin:15px 0; padding:15px; background:#f9f9f9; border-radius:8px; text-align:center; font-size:14px; color:#333;">
  <p style="margin:5px 0;"><strong>📞 SĐT:</strong> <a href="tel:0338538203" style="color:#2E86C1; text-decoration:none;">0338 538 203</a></p>
  <p style="margin:5px 0;"><strong>✉ Email:</strong> <a href="mailto:terashose@gmail.com" style="color:#2E86C1; text-decoration:none;">terashose@gmail.com</a></p>
</div>

<p style="margin-top:20px; font-size:15px; text-align:center;">💙 Cảm ơn bạn đã mua sắm tại <strong>Tera Shoes</strong>.</p>
<p style="color:#888; font-size:13px; text-align:center;">— Đội ngũ Tera Shoes</p>

  </div>
  </body>
  </html>
  `;
}

module.exports = { renderOrderEmail };
