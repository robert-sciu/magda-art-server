const pageImage = require("../models").sequelize.models.pageImage;
const { Op } = require("sequelize");
const { uploadFile } = require("../config/multer");
const {
  uploadFileToS3,
  getErrorResponseWithStatusInfo,
  attachImagePaths,
} = require("../utilities/utilities");

async function getAllImages(req, res) {
  try {
    const sectionImages = await pageImage.findAll();
    const sectionImagesDataJSON = sectionImages.map((image) => image.toJSON());
    await attachImagePaths(
      sectionImagesDataJSON,
      process.env.CONTENT_IMAGES_BUCKET_NAME
    );

    res.json({
      status: "success",
      data: sectionImagesDataJSON,
    });
  } catch (error) {
    getErrorResponseWithStatusInfo(error, "Error fetching main page image(s)");
  }
}

async function getCommon(req, res) {
  try {
    const commonImages = await pageImage.findAll({
      where: { role: { [Op.in]: ["logo", "socials"] } },
    });

    const commonImagesDataJSON = commonImages.map((image) => image.toJSON());
    await attachImagePaths(
      commonImagesDataJSON,
      process.env.CONTENT_IMAGES_BUCKET_NAME
    );

    res.json({
      status: "success",
      data: commonImagesDataJSON,
    });
  } catch (error) {
    getErrorResponseWithStatusInfo(error, "Error fetching common images");
  }
}

async function updateSectionImage(req, res) {
  const { imageName: name, role, placement = null } = JSON.parse(req.body.JSON);

  //////////////////////////////////////////////////////////
  // uploading file to s3 //////////////////////////////////
  //////////////////////////////////////////////////////////
  try {
    await uploadFileToS3(req.file, process.env.CONTENT_IMAGES_BUCKET_NAME);
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(error, "Error uploading image to s3")
      );
    return;
  }

  ///////////////////////////////////////////////////////////
  // saving image data to db ////////////////////////////////
  ///////////////////////////////////////////////////////////

  const newContentImageData = {
    fileName: req.file.originalname,
    role,
    placement,
    name,
  };

  try {
    const newContentImage = await pageImage.create(newContentImageData);
    res.json({
      status: "success",
      message: "file uploaded successfully",
      data: newContentImage.dataValues,
    });
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(
          error,
          "Error creating new database entry"
        )
      );
    return;
  }
}

module.exports = {
  getAllImages,
  updateSectionImage,
  uploadFile,
  getCommon,
};
