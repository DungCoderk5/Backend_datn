require("dotenv").config();
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
function renderOrderEmail(order) {
  const currency = (amount) => `${amount.toLocaleString()}₫`;

  const rows = order.order_items
    .map((item) => {
      const product = item.variant.product;
      const img = item.variant.color?.images
        ? `${BASE_URL}/${item.variant.color.images}`
        : "https://via.placeholder.com/60";

      const color = item.variant.color?.name_color || "Không rõ"; // ✅ sửa đúng field
      const size = item.variant.size?.number_size || "Không rõ"; // ✅ sửa đúng field
      const subtotal = item.unit_price * item.quantity;

      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px; display: flex; align-items: center;">
            <img src="${img}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px; border-radius: 8px;" />
            <div>
              <div style="font-weight: bold;">${product.name}</div>
              <div style="font-size: 12px; color: #666;">Màu: ${color}, Size: ${size}</div>
            </div>
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${currency(item.unit_price)}</td>
          <td style="text-align: right;">${currency(subtotal)}</td>
        </tr>`;
    })
    .join("");

  const shippingFee = order.shipping_fee || 0;
  const discount = order.coupon?.discount_value || 0;
  const totalAmount = order.total_amount;

  return `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; border: 1px solid #ddd; color: #333;">
  <h2 style="color: #2E86C1;"> Xác nhận đơn hàng #${order.orders_id}</h2>

  <p>Xin chào <strong>${order.user?.name || "Khách hàng"}</strong>,</p>
  <p>Cảm ơn bạn đã mua hàng tại <strong>Tera Shoes</strong>. Chúng tôi đã nhận được đơn hàng của bạn với thông tin sau:</p>

  <hr style="margin: 20px 0;" />

  <h3 style="color: #2E86C1;"> Chi tiết sản phẩm</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background-color: #f0f0f0;">
        <th style="padding: 10px; text-align: left;">Sản phẩm</th>
        <th style="padding: 10px;">SL</th>
        <th style="padding: 10px; text-align: right;">Đơn giá</th>
        <th style="padding: 10px; text-align: right;">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <hr style="margin: 20px 0;" />

  <h3 style="color: #2E86C1;"> Thông tin giao hàng</h3>
  <p><strong>Người nhận:</strong> ${order.user?.name || ""}</p>
  <p><strong>Địa chỉ:</strong> ${order.shipping_address?.address_line || "Không rõ"}</p>
  <p><strong>Phương thức thanh toán:</strong> ${order.payment_method?.name_method || "Không rõ"}</p>

  <hr style="margin: 20px 0;" />

  <h3 style="color: #2E86C1;">   Tóm tắt đơn hàng</h3>
  <table style="width: 100%; font-size: 15px;">
    <tr>
      <td>Tạm tính:</td>
      <td style="text-align: right;">${currency(totalAmount - shippingFee + discount)}</td>
    </tr>
    <tr>
      <td>Giảm giá:</td>
      <td style="text-align: right;">– ${currency(discount)}</td>
    </tr>
    <tr>
      <td>Phí vận chuyển:</td>
      <td style="text-align: right;">${currency(shippingFee)}</td>
    </tr>
    <tr style="font-weight: bold; font-size: 16px;">
      <td>Tổng thanh toán:</td>
      <td style="text-align: right; color: #d32f2f;">${currency(totalAmount)}</td>
    </tr>
  </table>

  <p style="margin-top: 30px;">Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
  <p>💙 Cảm ơn bạn đã mua sắm tại <strong>Tera Shoes</strong>.</p>
  <p style="color: #888;">— Đội ngũ Tera Shoes</p>
</div>

  `;
}

module.exports = { renderOrderEmail };
