const sharp = require("sharp");

const resolutions = {
  large: 1920,
  medium: 960,
  small: 500,
  mobile: 500,
  lazy: 100,
};

function compressImage(width, buffer) {
  return sharp(buffer)
    .resize({ width: width, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}

function sharpCompressor(size, buffer) {
  switch (size) {
    case "small":
      return compressImage(resolutions.small, buffer);
    case "medium":
      return compressImage(resolutions.medium, buffer);
    case "large":
      return compressImage(resolutions.large, buffer);
    case "mobile":
      return compressImage(resolutions.mobile, buffer);
    case "lazy":
      return compressImage(resolutions.lazy, buffer);
    default:
      return buffer;
  }
}

/**
 * Compresses an image file using sharp, based on the given size
 * @param {string} size - size of the image to compress, can be one of "small", "medium", "large"
 * @param {Object} file - multer file object
 * @param {string} filename - optional filename to use for the compressed image
 * @returns {Promise<Object>} - a promise that resolves to the compressed image object
 */
async function fileCompressor({ size, file }) {
  if (!["small", "medium", "large", "mobile", "lazy"].includes(size)) {
    throw new Error("Invalid size");
  }
  try {
    const compressedImage = await sharpCompressor(size, file.buffer);

    const data = {
      ...file,
      buffer: compressedImage,
      size: compressedImage.length,
    };
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = fileCompressor;
