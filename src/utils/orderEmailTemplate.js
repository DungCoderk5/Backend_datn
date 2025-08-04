function renderOrderEmail(order) {
  const currency = (amount) => `${amount.toLocaleString()}₫`;

  const rows = order.order_items
    .map((item) => {
      const product = item.variant.product;
      const img =
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0].url
          : "https://via.placeholder.com/60";

      const color = item.item.variant?.color.name_color || "Không rõ";
      const size = item.variant?.size.number_size || "Không rõ";
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

  const shippingFee = order.shipping_address?.shipping_fee || 0;
  const discount = order.coupon?.discount_value || 0;
  const totalAmount = order.total_amount;

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 700px; margin: auto;">
      <h2 style="color: #1a73e8;">🛍️ Đơn hàng #${order.orders_id} đã được xác nhận!</h2>
      <p>Xin chào <strong>${order.user?.name || "Khách hàng"}</strong>,</p>
      <p>Cảm ơn bạn đã đặt hàng tại <strong>Tera Shoes</strong>. Dưới đây là thông tin chi tiết đơn hàng của bạn:</p>

      <h3>🧾 Chi tiết sản phẩm</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
        <thead style="background-color: #f5f5f5;">
          <tr>
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

      <br/>
      <h3>📦 Thông tin giao hàng</h3>
      <p><strong>Người nhận:</strong> ${order.user?.name || ""}</p>
      <p><strong>Địa chỉ:</strong> ${order.shipping_address?.address_line || "Không rõ"}</p>
      <p><strong>Phương thức thanh toán:</strong> ${order.payment_method?.name || "Không rõ"}</p>

      <br/>
      <h3>💰 Tóm tắt đơn hàng</h3>
      <table style="width: 100%; border-collapse: collapse;">
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

      <br/>
      <p>📨 Đơn hàng sẽ được xử lý và giao trong thời gian sớm nhất.</p>
      <p style="margin-top: 30px;">Cảm ơn bạn đã tin tưởng <strong>Tera Shoes</strong>!</p>
      <p style="color: #888;">— Đội ngũ Tera Shoes</p>
    </div>
  `;
}

module.exports = { renderOrderEmail };
