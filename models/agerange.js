"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AgeRange extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.AgeRange.hasMany(models.Article, {
        as: "article",
        foreignKey: "ageRangeId",
        onDelete: "CASCADE",
      });
    }
  }
  AgeRange.init(
    {
      range: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AgeRange",
    }
  );
  return AgeRange;
};
