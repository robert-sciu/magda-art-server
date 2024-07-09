const sharp = require("sharp");
// const minioClient = require("../config/minio");
const sizeOf = require("image-size");
const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-central-1",
});

const s3 = new AWS.S3();

function getImageDimmensions(file) {
  const { width: width_px, height: height_px } = sizeOf(file.buffer);
  const dimmensions = { width_px, height_px };
  return dimmensions;
}

function getErrorResponseWithStatusInfo(error, StatusInfo) {
  return { status: StatusInfo, message: error.message, data: {} };
}

function uploadFileToS3(file, bucketName) {
  const fileContent = file.buffer;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${bucketName}/${file.originalname}`,
    Body: fileContent,
  };

  return s3.upload(params).promise();
}

// async function uploadFileToS3(file, bucketName) {
//   try {
//     const metadata = { "Content-Type": file.mimetype };
//     const data = await minioClient.putObject(
//       bucketName,
//       file.originalname,
//       file.buffer,
//       metadata
//     );
//     console.log(data);
//   } catch (error) {
//     throw new Error(error);
//   }
// }

// async function deleteFileFromS3(file, bucketName) {
//   try {
//     await minioClient.removeObject(bucketName, file);
//   } catch (error) {
//     throw new Error(error);
//   }
// }

// async function attachImagePaths(paintingsDataArrayJSON, bucketName) {
//   try {
//     for (const imageData of paintingsDataArrayJSON) {
//       imageData.url = await minioClient.presignedGetObject(
//         bucketName,
//         imageData.fileName,
//         24 * 60 * 60
//       );
//     }
//     return paintingsDataArrayJSON;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

async function attachImagePaths(paintingsDataArrayJSON, bucketName) {
  try {
    for (const imageData of paintingsDataArrayJSON) {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${bucketName}/${imageData.fileName}`, // Ensure the path includes the folder
        // Expires: 24 * 60 * 60, // 24 hours
      };
      imageData.url = s3.getSignedUrl("getObject", params);
    }
    return paintingsDataArrayJSON;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getPaintingDataObject(req) {
  const file = req.compressedFile;
  const dimmensions = getImageDimmensions(file);
  const json = JSON.parse(req.body.JSON);
  const fileName = file.originalname;

  return {
    ...dimmensions,
    ...json,
    fileName,
  };
}

async function getFullResPaintingDataObject(req) {
  const file = req.file;
  const fileName = file.originalname;
  const json = JSON.parse(req.body.JSON);

  return {
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
  getFullResPaintingDataObject,
  // deleteFileFromS3,
};
