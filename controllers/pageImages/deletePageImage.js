const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const pageImagesService = require("./pageImagesService");

async function deletePageImage(req, res) {
  const id = req.id;

  const transaction = await pageImagesService.getTransaction();
  try {
    const pageImage = await pageImagesService.getPageImageById(id);
    const deleteCount = await pageImagesService.deletePageImageDbEntry(
      id,
      transaction
    );
    if (deleteCount === 0) {
      await transaction.rollback();
      return handleErrorResponse(res, 404, "page image not found");
    }
    await pageImagesService.deletePageImageImages(pageImage);
    await transaction.commit();
    return handleSuccessResponse(res, 200, "image deleted");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "something went wrong");
  }
}

module.exports = deletePageImage;
