const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const config = require("../../config/config");
const pageImagesService = require("./pageImagesService");

async function getPageImagesForSection(req, res) {
  const section = req.id;
  if (!config.common.imageSections.includes(section)) {
    return handleErrorResponse(res, 404, "section not found");
  }
  try {
    const pageImages = await pageImagesService.getPageImagesForSection(section);
    return handleSuccessResponse(res, 200, pageImages);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "something went wrong");
  }
}

module.exports = getPageImagesForSection;
