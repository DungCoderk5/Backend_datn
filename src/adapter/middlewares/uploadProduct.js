const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { fromFile } = require('file-type');

const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeFieldName = file.fieldname
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
      .replace(/[^a-zA-Z0-9_-]/g, "_"); // bỏ ký tự đặc biệt

    const filename = `${Date.now()}-${safeFieldName}${ext}`;
    cb(null, filename);
  },
});

const multerUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: async (req, file, cb) => {
    cb(null, true);
  },
});

const validateRealImage = async (req, res, next) => {
  const allFiles = [];
  if (req.file) allFiles.push(req.file);
  if (Array.isArray(req.files)) allFiles.push(...req.files);

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
