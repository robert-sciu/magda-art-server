const pageImage = require("../models").sequelize.models.pageImage;
const { Op } = require("sequelize");
const { uploadFile } = require("../config/multer");
const {
  uploadFileToS3,
  getErrorResponseWithStatusInfo,
  attachImagePaths,
  deleteFileFromS3,
} = require("../utilities/utilities");
const sharp = require("sharp");

const resizeWidthValues = {
  hero: 2500,
  welcome: 500,
  bioParallax: 2500,
  bio: 500,
  galleryParallax: 2500,
  visualizations: 1000,
  contactBig: 500,
  contactSmall: 500,
  logo: 500,
};

const svgImages = ["socials"];

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
  const {
    imageName: name,
    role,
    placement = null,
    externalUrl = null,
  } = JSON.parse(req.body.JSON);

  //////////////////////////////////////////////////////////
  // compressing file //////////////////////////////////////
  //////////////////////////////////////////////////////////

  if (!svgImages.includes(role)) {
    try {
      const compressedImage = await sharp(req.file.buffer)
        .resize({ width: resizeWidthValues[role] })
        .toBuffer();

      req.file = { ...req.file, buffer: compressedImage };
    } catch (error) {
      res
        .status(400)
        .json(getErrorResponseWithStatusInfo(error, "Error compressing image"));
      return;
    }
  }

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
    externalUrl,
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

async function deleteSectionImage(req, res) {
  const idToDel = req.query.id;
  const imageData = await pageImage.findOne({ where: { id: idToDel } });

  const imageUsage = await pageImage.findAll({
    where: { fileName: imageData.fileName },
  });

  const otherRolesUsingImage = imageUsage
    .map((image) => image.role)
    .filter((role) => role !== imageData.role);

  if (otherRolesUsingImage.length === 0) {
    try {
      await deleteFileFromS3(
        imageData.fileName,
        process.env.CONTENT_IMAGES_BUCKET_NAME
      );
    } catch (error) {
      res.status(400).json(error.message);
      return;
    }
  }

  try {
    await pageImage.destroy({ where: { id: idToDel } });
  } catch (error) {
    res.status(400).json(error.message);
    return;
  }

  res.status(200).json({ status: "success", message: "file deleted" });
}

module.exports = {
  getAllImages,
  updateSectionImage,
  uploadFile,
  getCommon,
  deleteSectionImage,
};
