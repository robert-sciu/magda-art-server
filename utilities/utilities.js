const sizeOf = require("image-size");

function getImageDimmensions(file) {
  const { width: width_px, height: height_px } = sizeOf(file.buffer);
  const dimmensions = { width_px, height_px };
  return dimmensions;
}

function secureConnectionChecker(app) {
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.secure || req.get("X-Forwarded-Proto") === "https") {
        return next();
      } else {
        res.redirect("https://" + req.hostname + req.url);
      }
    });
  } else {
    app.use((req, res, next) => {
      next();
    });
  }
}

module.exports = {
  getImageDimmensions,
  secureConnectionChecker,
};
