const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const paintingsService = require("./paintingsService");

async function updatePainting(req, res) {
  const updateData = req.body;
  const id = req.id;

  if (!updateData) {
    return handleErrorResponse(res, 400, "no update data provided");
  }

  try {
    const updatedRowsCount = await paintingsService.updatePaintingDbEntry(
      updateData,
      id
    );

    if (updatedRowsCount === 0) {
      return handleErrorResponse(res, 404, "update failed");
    }

    const updatedPainting = await paintingsService.getPaingingById(id);

    return handleSuccessResponse(res, 200, updatedPainting);
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "something went wrong");
  }
}

module.exports = updatePainting;
