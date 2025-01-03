const { Content } = require("../../models").sequelize.models;

class ContentService {
  constructor() {}

  async getContent() {
    return await Content.findAll();
  }

  async updateContent(json) {
    return await Content.upsert(json);
  }
}

const contentService = new ContentService();

module.exports = contentService;
