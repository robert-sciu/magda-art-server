const content = require("../models").sequelize.models.content;

async function getAllContent(req, res) {
  try {
    const contentData = await content.findAll();
    res.json({ status: "success", data: contentData });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
}

async function updateContent(req, res) {
  const json = req.body;

  try {
    const contentData = await content.create(json);
    res.json({ status: "success", data: contentData });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
}

module.exports = {
  getAllContent,
  updateContent,
};
