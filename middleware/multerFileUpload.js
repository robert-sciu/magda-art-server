const multer = require("multer");
const { handleErrorResponse } = require("../utilities/controllerUtilities");

const memoryStorage = multer.memoryStorage();

const imageUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only JPEG, JPG, WEBP, PNG are allowed.")
      );
    }
    cb(null, true);
  },
});

function attachFileToRequest(req, res, next) {
  imageUpload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return handleErrorResponse(res, 400, err.message);
      } else if (err) {
        return handleErrorResponse(res, 400, err.message);
      }
    }
    next();
  });
}

module.exports = { attachFileToRequest };
