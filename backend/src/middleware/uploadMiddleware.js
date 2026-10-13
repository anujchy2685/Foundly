import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const uploadPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads"
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes[extension] === file.mimetype) {
    cb(null, true);
  } else {
    const error = new Error("Only JPG, JPEG, PNG and WEBP images are allowed");
    error.statusCode = 400;
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export default upload;