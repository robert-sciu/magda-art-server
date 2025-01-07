const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const paintingsService = require("../paintings/paintingsService");
const pageImagesService = require("./pageImagesService");

async function postPageImage(req, res) {
  const transaction = await pageImagesService.getTransaction();

  try {
    //   //////////////////////////////////////////////////////////
    //   // creating compressed file //////////////////////////////
    //   //////////////////////////////////////////////////////////

    [desktopImageData, mobileImageData, lazyImageData] =
      await pageImagesService.generateCompressedPageImageObjects(req);

    //   //////////////////////////////////////////////////////////
    //   //////////// uploading files to s3 ///////////////////////
    //   //////////////////////////////////////////////////////////

    await paintingsService.uploadPaintingImagesToS3([
      desktopImageData,
      mobileImageData,
      lazyImageData,
    ]);

    //   ///////////////////////////////////////////////////////////
    //   // saving image data to db ////////////////////////////////
    //   ///////////////////////////////////////////////////////////

    const { imageName, role, placement = null } = JSON.parse(req.body.JSON);

    const pageImageDbData = {
      imageName,
      role,
      placement,
      filename_desktop: desktopImageData.filename,
      filename_mobile: mobileImageData.filename,
      filename_lazy: lazyImageData.filename,
    };

    await pageImagesService.createPageImageDbEntry(
      pageImageDbData,
      transaction
    );

    await transaction.commit();
    return handleSuccessResponse(res, 200, "page image uploaded successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, "something went wrong");
  }
}

module.exports = postPageImage;
