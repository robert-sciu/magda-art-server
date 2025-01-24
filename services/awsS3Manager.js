const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const logger = require("../utilities/logger");

const s3Client = new S3Client({
  endpoint: "http://127.0.0.1:4569", // S3rver endpoint
  region: "us-east-1",
  forcePathStyle: true,
  accessKeyId: "accessKey1", // Setting the access key ID
  secretAccessKey: "verySecretKey1", // Setting the secret access key
});

function filePathFromFileObject(fileObject) {
  return `${fileObject.path}/${fileObject.filename}`;
}

async function uploadFileToS3({
  fileObject,
  filePath,
  bucketName = fileObject?.bucketName || process.env.BUCKET_NAME,
}) {
  // const filePath = filePathFromFileObject(fileObject);

  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: filePath,
      Body: fileObject.file.buffer,
      ContentType: fileObject.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    if (!(await checkIfFileExists(bucketName, filePath))) {
      throw new Error(`Error uploading file: ${fileObject.filename}`);
    }
  } catch (error) {
    logger.error(error);
    console.log(error.message);
    throw new Error(`Error uploading file: ${fileObject.filename}`);
  }
}

// Check if a file exists in S3
async function checkIfFileExists(bucketName, filePath) {
  try {
    const headParams = {
      Bucket: bucketName,
      Key: filePath,
    };
    await s3Client.send(new HeadObjectCommand(headParams));
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      return false;
    }
    logger.error(error);
    throw new Error(`Error checking existence of file: ${filePath}`);
  }
}

async function deleteFileFromS3({
  filePath,
  bucketName = process.env.BUCKET_NAME,
}) {
  // const filePath = filePathFromFileObject(fileObject);
  try {
    const params = {
      Bucket: bucketName,
      Key: filePath,
    };

    await s3Client.send(new DeleteObjectCommand(params));

    if (await checkIfFileExists(bucketName, filePath)) {
      throw new Error(`Error deleting file: ${filePath}`);
    }
  } catch (error) {
    logger.error(error);
    throw new Error(`Error deleting file: ${filePath}`);
  }
}

async function attachImageURLs({
  imagesArray,
  containingFolder,
  bucketName = process.env.BUCKET_NAME,
}) {
  const dataArray = imagesArray.map((imageData) =>
    imageData.get({ plain: true })
  );

  try {
    const updatedArray = await Promise.all(
      dataArray.map(async (imageData) => {
        const desktopPath = `${containingFolder}/${process.env.DESKTOP_IMG_FOLDER_NAME}/${imageData.filename_desktop}`;
        const mobilePath = `${containingFolder}/${process.env.MOBILE_IMG_FOLDER_NAME}/${imageData.filename_mobile}`;
        const lazyPath = `${containingFolder}/${process.env.LAZY_IMG_FOLDER_NAME}/${imageData.filename_lazy}`;

        const commandDesktop = new GetObjectCommand({
          Bucket: bucketName,
          Key: desktopPath,
        });
        imageData.url_desktop = await getSignedUrl(s3Client, commandDesktop, {
          expiresIn: 24 * 60 * 60,
        });

        const commandMobile = new GetObjectCommand({
          Bucket: bucketName,
          Key: mobilePath,
        });
        imageData.url_mobile = await getSignedUrl(s3Client, commandMobile, {
          expiresIn: 24 * 60 * 60,
        });

        const commandLazy = new GetObjectCommand({
          Bucket: bucketName,
          Key: lazyPath,
        });
        imageData.url_lazy = await getSignedUrl(s3Client, commandLazy, {
          expiresIn: 24 * 60 * 60,
        });
        return imageData;
      })
    );
    return updatedArray;
  } catch (error) {
    logger.error(error);
    throw new Error(`Error attaching image URLs`);
  }
}

async function getSignedUrlFromS3(bucketName, filePath) {
  const params = {
    Bucket: bucketName,
    Key: filePath,
  };
  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    logger.error(error);
    throw new Error(`Error getting signed URL`);
  }
}

async function deleteAllFilesFromS3(bucketName, path) {
  try {
    const listParams = {
      Bucket: bucketName,
      Prefix: path,
    };

    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: bucketName,
      Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
    };

    await s3Client.send(new DeleteObjectsCommand(deleteParams));
  } catch (error) {
    logger.error(error);
    throw new Error(`Error deleting files`);
  }
}

async function bulkCheckIfFilesExist({
  fileObjectsArray,
  bucketName = fileObjectsArray[0]?.bucketName || process.env.BUCKET_NAME,
}) {
  try {
    for (const fileObject of fileObjectsArray) {
      const filePath = filePathFromFileObject(fileObject);
      const exists = await checkIfFileExists(bucketName, filePath);
      if (exists) {
        return true;
      }
    }
    return false;
  } catch (error) {
    logger.error(error);
    throw new Error(`Error checking existence of files`);
  }
}

/**
 * Uploads multiple files to S3 and returns an array of the uploaded files
 * with their bucketName and path.
 *
 * If any error occurs during the upload process, it deletes any files that
 * were uploaded before the error and rethrows the error.
 *
 * @param {Array<Object>} fileObjectsArray - Array of objects with shape
 *   {
 *     bucketName: string,
 *     path: string,
 *     file: {
 *       buffer: Buffer,
 *       mimetype: string,
 *       originalname: string,
 *     },
 *   }
 *
 * @returns {Promise<Array<{bucketName: string, path: string}>>}
 *   Array of uploaded files with their bucketName and path.
 */
async function bulkUploadImages(fileObjectsArray) {
  const uploadedFiles = [];
  if (await bulkCheckIfFilesExist({ fileObjectsArray })) {
    throw new Error("Files already exist");
  }
  try {
    for (const fileObject of fileObjectsArray) {
      // console.log(fileObject);
      await uploadFileToS3({
        fileObject: fileObject,
        filePath: filePathFromFileObject(fileObject),
      });
      uploadedFiles.push({
        bucketName: fileObject.bucketName,
        path: filePathFromFileObject(fileObject),
      });
    }
  } catch (error) {
    logger.error(error);
    // Rollback: Delete any files that were uploaded before the error
    await Promise.all(
      uploadedFiles.map(async (fileObject) => {
        try {
          await deleteFileFromS3({ fileObject });
        } catch (error) {
          logger.error(error);
          console.error(`Failed to delete file during rollback: ${file.path}`);
        }
      })
    );

    throw new Error(
      `Error uploading files, rolled back successfully uploaded files: ${error.message}`
    );
  }
}

async function bulkDeleteImages({ filePathsArray }) {
  try {
    await Promise.all(
      filePathsArray.map(async (filePath) => {
        await deleteFileFromS3({ filePath });
      })
    );
  } catch (error) {
    logger.error(error);
    throw new Error(`Error deleting files`);
  }
}

module.exports = {
  uploadFileToS3,
  checkIfFileExists,
  deleteFileFromS3,
  attachImageURLs,
  deleteAllFilesFromS3,
  bulkCheckIfFilesExist,
  bulkUploadImages,
  getSignedUrlFromS3,
  bulkDeleteImages,
};
