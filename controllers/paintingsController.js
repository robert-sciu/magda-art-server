const painting = require("../models").sequelize.models.painting;
const paintingFullRes = require("../models").sequelize.models.paintingFullRes;
const { uploadFile } = require("../config/multer");
const {
  getErrorResponseWithStatusInfo,
  uploadFileToS3,
  deleteFileFromS3,
  attachImagePaths,
  getPaintingDataObject,
  getFullResPaintingDataObject,
} = require("../utilities/utilities");

const fs = require("fs").promises;
const sharp = require("sharp");

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
      where: { paintingId: req.query.paintingId },
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

async function deletePaintingById(req, res) {
  const idToDel = req.query.id;
  const imageData = await painting.findOne({ where: { id: idToDel } });
  try {
    await deleteFileFromS3(
      imageData.fileName,
      process.env.PAINTINGS_BUCKET_NAME
    );
  } catch (error) {
    throw new Error(error.message);
  }
  try {
    await painting.destroy({ where: { id: idToDel } });
  } catch (error) {
    throw new Error(error.message);
  }
  res.status(200).json({ status: "success", message: "file deleted" });
}

module.exports = {
  uploadFile,
  // checkPaitningId,
  getAllPaintings,
  postPainting,
  deletePaintingById,
  getFullResPainting,
};
