const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const paintingsService = require("./paintingsService");

async function postPainting(req, res) {
  const transaction = await paintingsService.getTransaction();

  try {
    //   //////////////////////////////////////////////////////////
    //   // creating compressed file //////////////////////////////
    //   //////////////////////////////////////////////////////////
    [desktopImageData, mobileImageData, lazyImageData] =
      await paintingsService.generateCompressedPaintingImageObjects(req);

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

    const { width_px, height_px } = paintingsService.getImageDimmensions(
      desktopImageData.file
    );
    const {
      title,
      description_en,
      description_de,
      description_es,
      description_pl,
      width_cm,
      height_cm,
      price_eur,
      is_available,
    } = paintingsService.destructurePaintingDataForDb(req.body.JSON);

    const paintingDbData = {
      title,
      description_en,
      description_de,
      description_es,
      description_pl,
      filename_desktop: desktopImageData.filename,
      filename_mobile: mobileImageData.filename,
      filename_lazy: lazyImageData.filename,
      width_cm,
      height_cm,
      width_px,
      height_px,
      price_eur,
      is_available,
    };

    await paintingsService.createPaintingDbEntry(paintingDbData, transaction);

    await transaction.commit();
    return handleSuccessResponse(res, 200, "file uploaded successfully");
  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    return handleErrorResponse(res, 500, error.message);
  }
}

module.exports = postPainting;
