const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const paintingsService = require("./paintingsService");

async function deletePainting(req, res) {
  const id = req.id;
  const transaction = await paintingsService.getTransaction();
  try {
    const painting = await paintingsService.getPaingingById(id);
    const deleteCount = await paintingsService.deletePaintingDbEntry(
      id,
      transaction
    );
    if (deleteCount === 0) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "painting not found");
    }
    await paintingsService.deletePaintingImages(painting);

    await transaction.commit();

    return handleSuccessResponse(res, 204, "painting deleted");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "something went wrong");
  }
}

module.exports = deletePainting;
