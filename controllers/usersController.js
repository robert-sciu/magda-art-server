const bcrypt = require("bcryptjs");
const User = require("../models").sequelize.models.user;

module.exports = {
  createUser: {
    active: async (req, res) => {
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
    },
    disabled: async (req, res) => {
      res.json({ status: "error", message: "not allowed for now" });
    },
  },
};
