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
        unique: false,
      },
      content: {
        type: DataTypes.TEXT,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      createdAt: false,
      timestamps: false,
    }
  );
  return Content;
};
