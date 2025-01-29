const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const paintingsService = require("./paintingsService");

async function getPaintings(req, res) {
  try {
    const paintings = await paintingsService.getAllPaintings();

    return handleSuccessResponse(res, 200, paintings);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "something went wrong");
  }
}

module.exports = getPaintings;
