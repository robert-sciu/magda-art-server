const painting = require("../models").sequelize.models.painting;
const paintingFullRes = require("../models").sequelize.models.paintingFullRes;
const { uploadFile } = require("../config/multer");
const {
  getErrorResponseWithStatusInfo,
  uploadFileToS3,
  attachImagePaths,
  getPaintingDataObject,
  getFullResPaintingDataObject,
} = require("../utilities/utilities");

const fs = require("fs").promises;

/*/////////////////////////////////////////
// routes controllers for / route
//////////////////////////////////////// */

async function getAllPaintings(req, res) {
  try {
    const paintings = await painting.findAll();
    const paintingsDataArrayJSON = paintings.map((painting) =>
      painting.toJSON()
    );
    await attachImagePaths(
      paintingsDataArrayJSON,
      process.env.PAINTINGS_BUCKET_NAME
    );
    res.json({ status: "success", data: paintingsDataArrayJSON });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
}

async function getFullResPainting(req, res) {
  let fullResPainting;
  try {
    fullResPainting = await paintingFullRes.findOne({
      where: { imageId: req.query.imageId },
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }

  try {
    const paintingJSON = [fullResPainting.toJSON()];
    await attachImagePaths(
      paintingJSON,
      process.env.FULL_RES_PAINTINGS_BUCKET_NAME
    );
    res.json({ status: "success", data: paintingJSON });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
}

async function postFullResPainting(req, res) {
  try {
    await uploadFileToS3(req.file, process.env.FULL_RES_PAINTINGS_BUCKET_NAME);
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(error, "Error uploading image to s3")
      );
    return;
  }

  let fullResPaintingData;

  try {
    fullResPaintingData = await getFullResPaintingDataObject(req);
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(
          error,
          "Error creating image data object"
        )
      );
  }

  try {
    const newFullResPainting = await paintingFullRes.create(
      fullResPaintingData
    );
    res.json({
      status: "success",
      message: "full Resolution file uploaded successfully",
      data: newFullResPainting.dataValues,
    });
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(error, "Error saving image data to db")
      );
  }
}

async function postPainting(req, res) {
  //////////////////////////////////////////////////////////
  // uploading file to s3 //////////////////////////////////
  //////////////////////////////////////////////////////////

  try {
    await uploadFileToS3(req.file, process.env.PAINTINGS_BUCKET_NAME);
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(error, "Error uploading image to s3")
      );
    return;
  }

  ///////////////////////////////////////////////////////////
  // completing image data for db storate which includes ////
  // accessing file on s3 and getting image dimmensions /////
  ///////////////////////////////////////////////////////////
  let newPaintingData;
  try {
    newPaintingData = await getPaintingDataObject(req);
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(
          error,
          "Error creating image data object"
        )
      );
  }
  ///////////////////////////////////////////////////////////
  // saving image data to db ////////////////////////////////
  ///////////////////////////////////////////////////////////
  try {
    const newPainting = await painting.create(newPaintingData);
    res.json({
      status: "success",
      message: "file uploaded successfully",
      data: newPainting.dataValues,
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

/*/////////////////////////////////////////
// routes controllers for /:id route
//////////////////////////////////////// */

async function checkPaitningId(req, res, next, id) {
  try {
    const paintingData = await painting.findOne({ where: { id: id } });
    req.paintingData = paintingData;
    next();
  } catch (error) {
    res.json({ status: "error", message: "invalid id: " + error.message });
  }
}

async function deletePaintingById(req, res) {
  try {
    await fs.rm(req.paintingData.path, { force: true });
  } catch (error) {
    res.json({ status: "error", message: error.message });
    return;
  }

  try {
    await painting.destroy({ where: { id: req.paintingData.id } });
  } catch (error) {
    res.json({ status: "error", message: error.message });
    return;
  }
  res.json({ status: "success", message: "file deleted" });
}

module.exports = {
  uploadFile,
  checkPaitningId,
  getAllPaintings,
  postPainting,
  deletePaintingById,
  getFullResPainting,
  postFullResPainting,
};
