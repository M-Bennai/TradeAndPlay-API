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
      models.Article.belongsTo(models.Category, {
        as: "category",
        foreignKey: "categoryId",
        onDelete: "CASCADE",
      });
      models.Article.belongsTo(models.Value, {
        as: "value",
        foreignKey: "valueId",
        onDelete: "CASCADE",
      });
      models.Article.belongsTo(models.AgeRange, {
        as: "ageRange",
        foreignKey: "ageRangeId",
        onDelete: "CASCADE",
      });
    }
  }
  Article.init(
    {
      title: DataTypes.STRING,
      condition: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING,
      trade: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
