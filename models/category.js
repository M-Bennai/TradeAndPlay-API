"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // models.Category.belongsTo(models.Article, {
      //   as: "article",
      //   foreignKey: "articleId",
      // });
      models.Category.hasMany(models.Article, {
        as: "article",
        foreignKey: "categoryId",
        onDelete: "CASCADE",
      });
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
