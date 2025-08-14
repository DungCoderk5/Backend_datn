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

// validateRealImage sửa lại
const validateRealImage = async (req, res, next) => {
  const allFiles = [];

  if (req.file) {
    allFiles.push(req.file);
  }
  if (Array.isArray(req.files)) {
    allFiles.push(...req.files);
  }

  if (allFiles.length === 0) return next();

  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/webp',
    'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml'
  ];

  for (const file of allFiles) {
    const filePath = file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: `File ${file.originalname} không tồn tại trên server!` });
    }

    const fileType = await fromFile(filePath);

    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: `File ${file.originalname} không đúng định dạng` });
    }
  }

  next();
};



module.exports = {
  upload: multerUpload,
  validateRealImage,
};
