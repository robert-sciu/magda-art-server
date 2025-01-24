const sizeOf = require("image-size");

function getImageDimmensions(file) {
  const { width: width_px, height: height_px } = sizeOf(file.buffer);
  const dimmensions = { width_px, height_px };
  return dimmensions;
}

module.exports = {
  getImageDimmensions,
};
