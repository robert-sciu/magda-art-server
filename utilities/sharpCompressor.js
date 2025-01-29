const sharp = require("sharp");
const config = require("../config/config");

/**
 * Compresses an image file using sharp, based on the given size
 * @param {string} size - size of the image to compress, can be one of "small", "medium", "large"
 * @param {Object} file - multer file object
 * @param {string} filename - optional filename to use for the compressed image
 * @returns {Promise<Object>} - a promise that resolves to the compressed image object
 */
async function fileCompressor({ size, file }) {
  const resolutions = config.common.imageResolutions;

  if (!Object.keys(resolutions).includes(size)) {
    throw new Error("Invalid size");
  }

  try {
    const compressedImage = await sharp(file.buffer)
      .resize({
        width: resolutions[size],
        fit: "inside",
      })
      .webp({ quality: 85 })
      .toBuffer();

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
