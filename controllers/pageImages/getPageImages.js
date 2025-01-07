const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const pageImagesService = require("./pageImagesService");

async function getPageImages(req, res) {
  try {
    const pageImages = await pageImagesService.getAllPageImages();
    return handleSuccessResponse(res, 200, pageImages);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "something went wrong");
  }
}

module.exports = getPageImages;
