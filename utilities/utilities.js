const sharp = require("sharp");
const minioClient = require("../config/minio");
const sizeOf = require("image-size");

function getImageDimmensions(file) {
  const { width: width_px, height: height_px } = sizeOf(file.buffer);
  const dimmensions = { width_px, height_px };
  return dimmensions;
}

function getErrorResponseWithStatusInfo(error, StatusInfo) {
  return { status: StatusInfo, message: error.message, data: {} };
}

async function uploadFileToS3(file, bucketName) {
  try {
    const metadata = { "Content-Type": file.mimetype };
    await minioClient.putObject(
      bucketName,
      file.originalname,
      file.buffer,
      metadata
    );
  } catch (error) {
    throw new Error(error);
  }
}

async function attachImagePaths(paintingsDataArrayJSON, bucketName) {
  try {
    for (const imageData of paintingsDataArrayJSON) {
      imageData.url = await minioClient.presignedGetObject(
        bucketName,
        imageData.fileName,
        24 * 60 * 60
      );
    }
    return paintingsDataArrayJSON;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getPaintingDataObject(req, bucketName) {
  const file = req.file;

  const dimmensions = getImageDimmensions(file);
  const json = JSON.parse(req.body.JSON);
  const fileName = file.originalname;

  return {
    ...dimmensions,
    ...json,
    fileName,
  };
}

module.exports = {
  getImageDimmensions,
  getErrorResponseWithStatusInfo,
  uploadFileToS3,
  attachImagePaths,
  getPaintingDataObject,
};
