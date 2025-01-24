module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define(
    "Content",
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
