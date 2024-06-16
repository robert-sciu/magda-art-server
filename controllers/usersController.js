const bcrypt = require("bcryptjs");
const User = require("../models").sequelize.models.user;

async function getUser(req, res) {
  res.json({ status: "ok" });
}

async function createUser(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: true,
    });
  } catch (err) {
    res.status(500).send();
    return;
  }

  res.json({ status: "ok", message: "user created" });
}

module.exports = { getUser, createUser };
