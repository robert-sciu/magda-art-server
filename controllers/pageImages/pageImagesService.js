const imageCompressor = require("../../services/imageCompressor");
const { sequelize } = require("../../models");
const { Op } = require("sequelize");
const s3Manager = require("../../services/s3Manager");
const {
  createRecord,
  findAllRecords,
  findRecordByValue,
  deleteRecord,
} = require("../../utilities/dbUtilities");
const { PageImage } = require("../../models").sequelize.models;
const paths = require("../../config/config").common.paths;
const imageResolutionTypes = require("../../config/config").common
  .imageResolutionTypes;

class PageImagesService {
  constructor() {}
  desktopSizes = {
    hero: "large",
    welcome: "small",
    bioParallax: "large",
    bio: "small",
    galleryParallax: "large",
    visualizations: "medium",
    contactBig: "medium",
    contactSmall: "small",
    logo: "small",
  };

  async getTransaction() {
    return await sequelize.transaction();
  }

  async getAllPageImages() {
    const pageImages = await findAllRecords(PageImage);
    return await this.attachImagePaths(pageImages);
  }

  async getAllCommonPageImages() {
    const pageImages = await findAllRecords(PageImage, {
      role: { [Op.in]: ["logo", "socials"] },
    });
    return await this.attachImagePaths(pageImages);
  }

  async getPageImageById(id) {
    return await findRecordByValue(PageImage, { id });
  }

  async attachImagePaths(imagesArray) {
    const containingFolder = process.env.PAGE_IMG_FOLDER_NAME;
    return await s3Manager.attachImageURLs({ imagesArray, containingFolder });
  }

  async generateCompressedPageImageObjects(req) {
    const pageImagesFolder = process.env.PAGE_IMG_FOLDER_NAME;
    const { imageName, role } = JSON.parse(req.body.JSON);
    const { originalname } = req.file;

    return await imageCompressor.generateCompressedImageObjects({
      imgFolder: pageImagesFolder,
      file: req.file,
      filename: `${role}-${imageName.toLowerCase()}` || originalname,
      desktopSize: this.desktopSizes[role],
    });
  }

  async uploadPageImagesToS3(array) {
    return await s3Manager.bulkUploadImages(array);
  }

  async createPageImageDbEntry(data, transaction) {
    return await createRecord(PageImage, data, transaction);
  }

  async deletePageImageDbEntry(id, transaction) {
    return await deleteRecord(PageImage, id, transaction);
  }

  async deletePageImageImages(imageObject) {
    const filePathsArray = imageResolutionTypes.map(
      (size) => `${paths.pageImages[size]}/${imageObject[`filename_${size}`]}`
    );
    return await s3Manager.bulkDeleteImages({ filePathsArray });
  }
}

const pageImagesService = new PageImagesService();

module.exports = pageImagesService;
