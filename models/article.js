"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Article.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
      models.Article.hasOne(models.Category, {
        as: "category",
        foreignKey: "articleId",
        onDelete: "CASCADE",
      });
    }
  }
  Article.init(
    {
      title: DataTypes.STRING,
      ageRange: DataTypes.STRING,
      condition: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
