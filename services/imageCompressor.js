const fileCompressor = require("../utilities/sharpCompressor");
const config = require("../config/config");

class ImageCompressor {
  constructor() {}
  // addFilePathsToImageData(data, sizeOnPage) {
  //   // createImageSizesConfigObject returns three objects with compression type, size path and file prefix
  //   //for desktop, mobile and lazy image sizes
  //   // compression type is used by sharp, sizePath and filePrefix are used by s3Manager to prepare the file names
  //   // and put them in respective folders
  //   // size on page is the only property that can be changed, lazy and mobile image sizes are always the same
  //   // sizeOnPage is the compression type for desktop image
  //   const sizes = sizeOnPage
  //     ? createImageSizesConfigObject(sizeOnPage)
  //     : createImageSizesConfigObject(data.sizeOnPage);
  //   // createPathsObjectForAllSizes gets the sizes objects and the file original name and returns
  //   // data object with three properties: desktop, mobile and lazy, each containing paths to the compressed images
  //   // it does not compress the original image, it just adds paths based on the compression type and original name.
  //   const pathsData = createPathsObjectForAllSizes(data, sizes);
  //   const dataWithPaths = {
  //     ...data,
  //     ...pathsData,
  //   };
  //   dataWithPaths.sizeOnPage = sizeOnPage ? sizeOnPage : data.sizeOnPage;
  //   return dataWithPaths;
  // }

  createImageSizesConfigObject(sizeOnPage) {
    return {
      desktop: {
        compressionType: sizeOnPage,
        sizeFolder: process.env.DESKTOP_IMG_FOLDER_NAME,
        filePrefix: "desktop",
      },
      mobile: {
        compressionType: sizeOnPage === "large" ? "mobileLarge" : "mobile",
        sizeFolder: process.env.MOBILE_IMG_FOLDER_NAME,
        filePrefix: "mobile",
      },
      lazy: {
        compressionType: "lazy",
        sizeFolder: process.env.LAZY_IMG_FOLDER_NAME,
        filePrefix: "lazy",
      },
    };
  }

  /**
   * generates compressed image objects for s3Manager to upload
   * also adds filename property to the compressed image containing compression type and title
   * @param {Object} options - options object
   * @param {string} options.bucketName - name of the bucket
   * @param {string} options.imgFolder - path to the image in the bucket
   * @param {Object} options.inputFile - Multer file object
   * @param {string} options.filename - title of the painting
   * @param {number} options.desktopSize - size of the desktop image
   *                                       Available options: `large`, `medium`, `small`
   * @returns {Promise<Array<Object>>} - array of objects with three properties: bucketName, path, file and filename with compression prefix
   */

  async generateCompressedImageObjects({
    imgFolder,
    file,
    filename,
    desktopSize,
  }) {
    try {
      const availableResolutions = config.common.userSelectableImageResolutions;
      if (!availableResolutions.includes(desktopSize)) {
        throw new Error("Invalid desktop size");
      }

      const compressionSizes = this.createImageSizesConfigObject(desktopSize);

      const fileIsSVG = file.mimetype === "image/svg+xml";

      if (fileIsSVG) {
        const objects = Object.values(compressionSizes).map((params) => {
          return {
            path: `${imgFolder}/${params.sizeFolder}`,
            filename: `${params.filePrefix}-${filename
              .split(" ")
              .join("-")}.svg`,
            file,
          };
        });

        return objects;
      }

      const objects = await Promise.all(
        Object.values(compressionSizes).map(async (params) => {
          const compressedFile = await fileCompressor({
            size: params.compressionType,
            file,
          });

          return {
            path: `${imgFolder}/${params.sizeFolder}`,
            filename: `${params.filePrefix}-${filename
              .split(" ")
              .join("-")}.webp`,
            file: compressedFile,
          };
        })
      );

      return objects;
    } catch (error) {
      throw new Error(error);
    }
  }
}

const imageCompressor = new ImageCompressor();

module.exports = imageCompressor;
