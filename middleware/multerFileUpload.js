const multer = require("multer");

const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });

function attachFileToRequest(req, res, next) {
  upload.single("file")(req, res, next);
}

module.exports = { attachFileToRequest };
