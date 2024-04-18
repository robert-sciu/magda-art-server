const pageImage = require("../models").sequelize.models.pageImage;
const { uploadFile } = require("../utilities/multer");
const {
  uploadFileToS3,
  getErrorResponseWithStatusInfo,
  attachImagePaths,
} = require("../utilities/utilities");

async function setSectionName(req, res, next, sectionName) {
  req.section = sectionName;
  next();
}

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

async function updateSectionImage(req, res) {
  const { imageName: name } = JSON.parse(req.body.JSON);

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
    section: req.section,
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
  setSectionName,
};
