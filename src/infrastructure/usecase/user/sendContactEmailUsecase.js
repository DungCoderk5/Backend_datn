const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendContactEmailUsecase({ name, email, phone, message }) {
  if (!name || !email || !phone || !message) {
    return { error: 'Thiếu thông tin liên hệ.' };
  }

  const htmlContent = `
    <h3>Liên hệ mới từ khách hàng</h3>
    <p><strong>Họ tên:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Chủ đề:</strong> ${phone}</p>
    <p><strong>Nội dung:</strong><br>${message}</p>
  `;

  // ⚠️ Gợi ý dùng email mặc định Resend nếu domain của bạn chưa xác minh
  const fromEmail = process.env.MAIL_FROM || 'onboarding@resend.dev';

  try {
    const response = await resend.emails.send({
      from: `Liên hệ <${fromEmail}>`,
      to: [process.env.MAIL_RECEIVER || 'your@email.com'], // fallback nếu MAIL_RECEIVER chưa có
      subject: `[Liên hệ] ${phone}`,
      html: htmlContent,
    });

    if (response.error) {
      console.error('Resend error:', response.error);
      return { error: response.error.message || 'Không thể gửi email. Vui lòng thử lại.' };
    }

    return { message: 'Gửi liên hệ thành công!' };
  } catch (err) {
    console.error('Email send failed:', err);
    return { error: 'Không thể gửi email. Vui lòng thử lại.' };
  }
}

module.exports = sendContactEmailUsecase;
