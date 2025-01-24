const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const paintingsService = require("../paintings/paintingsService");
const pageImagesService = require("./pageImagesService");
const config = require("../../config/config");

async function postPageImage(req, res) {
  const transaction = await pageImagesService.getTransaction();
  console.log(req.body);
  // return handleSuccessResponse(res, 200, "image uploaded");

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

    const { imageName, role, externalUrl } = JSON.parse(req.body.JSON);

    const imagesForRole = await pageImagesService.getPageImagesForSection(
      role,
      transaction
    );
    const imageLimitForRole = config.common.pageImagesQuantityLimits[role];

    if (imagesForRole.length >= imageLimitForRole) {
      await transaction.rollback();
      return handleErrorResponse(res, 400, "role already has all the images");
    }

    const pageImageDbData = {
      imageName,
      role,
      filename_desktop: desktopImageData.filename,
      filename_mobile: mobileImageData.filename,
      filename_lazy: lazyImageData.filename,
      external_url: externalUrl || null,
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
    return handleErrorResponse(res, 500, error.message);
  }
}

module.exports = postPageImage;
