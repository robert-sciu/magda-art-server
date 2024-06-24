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

async function postPainting(req, res) {
  //   //////////////////////////////////////////////////////////
  //   // creating compressed file //////////////////////////////
  //   //////////////////////////////////////////////////////////
  try {
    const compressedPaintingBuffer = await sharp(req.file.buffer)
      .resize({ width: 960 })
      // .webp({ quality: 80 })
      .toBuffer();
    // attaching compressed buffer to req
    req.compressedFile = { ...req.file, buffer: compressedPaintingBuffer };
  } catch (error) {
    res
      .status(400)
      .json(getErrorResponseWithStatusInfo(error, "Error compressing image"));
    return;
  }

  //   //////////////////////////////////////////////////////////
  //   //////////// uploading files to s3 ///////////////////////
  //   //////////////////////////////////////////////////////////

  try {
    await uploadFileToS3(req.compressedFile, process.env.PAINTINGS_BUCKET_NAME);
    await uploadFileToS3(req.file, process.env.FULL_RES_PAINTINGS_BUCKET_NAME);
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(error, "Error uploading images to s3")
      );
    return;
  }

  //   ///////////////////////////////////////////////////////////
  //   // completing image data for db storate which includes ////
  //   // accessing file on s3 and getting image dimmensions /////
  //   ///////////////////////////////////////////////////////////

  try {
    const newPaintingData = await getPaintingDataObject(req);
    const fullResPaintingData = await getFullResPaintingDataObject(req);
    req.newPaintingData = newPaintingData;
    req.fullResPaintingData = fullResPaintingData;
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

  //   ///////////////////////////////////////////////////////////
  //   // saving image data to db ////////////////////////////////
  //   ///////////////////////////////////////////////////////////

  try {
    const newPainting = await painting.create(req.newPaintingData);
    req.fullResPaintingData.paintingId = newPainting.id;

    const newFullResPainting = await paintingFullRes.create(
      req.fullResPaintingData
    );

    res.json({
      status: "success",
      message: "full Resolution file uploaded successfully",
      data: {
        fullResPaintingData: newFullResPainting.dataValues,
        compressedPaintingData: newPainting.dataValues,
      },
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

  try {
  } catch (error) {
    res
      .status(400)
      .json(
        getErrorResponseWithStatusInfo(error, "Error saving image data to db")
      );
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
