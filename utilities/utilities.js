// const sharp = require("sharp");
const minioClient = require("../config/minio");
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

/////////////////////////////////////////////////////////////////////////
/////////////////////// AWS S3 OPS///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function uploadFileToS3Aws(file, bucketName) {
  const fileContent = file.buffer;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${bucketName}/${file.originalname}`,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  return s3.upload(params).promise();
}

async function deleteFileFromS3Aws(file, bucketName) {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${bucketName}/${file}`,
    };
    await s3.deleteObject(params).promise();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function attachImagePathsAws(paintingsDataArrayJSON, bucketName) {
  try {
    for (const imageData of paintingsDataArrayJSON) {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${bucketName}/${imageData.fileName}`,
        Expires: 24 * 60 * 60, // 24 hours
      };
      imageData.url = s3.getSignedUrl("getObject", params);
    }
    return paintingsDataArrayJSON;
  } catch (error) {
    throw new Error(error.message);
  }
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
/////////////////////// MINIO S3 OPS/////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

async function uploadFileToS3Minio(file, bucketName) {
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

async function deleteFileFromS3Minio(file, bucketName) {
  try {
    await minioClient.removeObject(bucketName, file);
  } catch (error) {
    throw new Error(error);
  }
}

async function attachImagePathsMinio(paintingsDataArrayJSON, bucketName) {
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

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

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

function secureConnectionChecker(app) {
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.secure || req.get("X-Forwarded-Proto") === "https") {
        return next();
      } else {
        res.redirect("https://" + req.hostname + req.url);
      }
    });
  } else {
    app.use((req, res, next) => {
      next();
    });
  }
}

const uploadFileToS3 =
  //prettier-ignore
  process.env.DISK_STORAGE === "aws" 
    ? uploadFileToS3Aws 
    : uploadFileToS3Minio;

const attachImagePaths =
  process.env.DISK_STORAGE === "aws"
    ? attachImagePathsAws
    : attachImagePathsMinio;

const deleteFileFromS3 =
  //prettier-ignore
  process.env.DISK_STORAGE === "aws" 
    ? deleteFileFromS3Aws 
    : deleteFileFromS3Minio;

module.exports = {
  getImageDimmensions,
  getErrorResponseWithStatusInfo,
  uploadFileToS3,
  attachImagePaths,
  getPaintingDataObject,
  getFullResPaintingDataObject,
  deleteFileFromS3,
  secureConnectionChecker,
};
