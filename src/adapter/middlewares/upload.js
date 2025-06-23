const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { fromFile } = require('file-type');

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

const multerUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: async (req, file, cb) => {
    // Tạm thời chấp nhận để multer lưu file, kiểm tra sau
    cb(null, true);
  },
});

// Middleware kiểm tra nội dung file sau khi lưu
const validateRealImage = async (req, res, next) => {
  if (!req.file) return next();

  const filePath = req.file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File không tồn tại trên server!' });
    }

const fileType = await fromFile(filePath);

    const allowedMimeTypes = [
      'image/jpeg',  // JPEG images
      'image/png',   // PNG images
      'image/webp',  // WebP images
      'image/gif',   // GIF images
      'image/bmp',   // BMP images
      'image/tiff',  // TIFF images
      'image/svg+xml'// SVG images (vector images)
    ];

    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      fs.unlinkSync(filePath); // Xóa file không hợp lệ
      return res.status(400).json({ error: 'File không đúng định dạng' });
    }

    next();
};

module.exports = {
  upload: multerUpload,
  validateRealImage,
};
