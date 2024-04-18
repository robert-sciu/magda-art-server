module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define(
    "content",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      heading: {
        type: DataTypes.STRING,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT,
      },
    },
    {
      createdAt: false,
      timestamps: false,
    }
  );
  return Content;
};
