const sharp = require("sharp");
const minioClient = require("../config/minio");
const sizeOf = require("image-size");

async function getImageDimmensions(bucketName, fileName) {
  try {
    const dataStream = await minioClient.getObject(bucketName, fileName);
    const chunks = [];
    for await (let chunk of dataStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const dimensions = sizeOf(buffer);
    return dimensions; // { width, height }
  } catch (error) {
    throw new Error(error);
  }
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
  let dimmensions;
  try {
    const { width: width_px, height: height_px } = await getImageDimmensions(
      bucketName,
      file.originalname
    );
    dimmensions = { width_px, height_px };
  } catch (error) {
    throw new Error(error);
  }
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
