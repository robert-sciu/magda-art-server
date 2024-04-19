const multer = require("multer");

const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });

function uploadFile(req, res, next) {
  upload.single("file")(req, res, next);
}

module.exports = { upload, uploadFile };
