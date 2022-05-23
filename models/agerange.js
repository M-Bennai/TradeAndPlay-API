"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ageRange extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ageRange.hasMany(models.Article, {
        as: "article",
        foreignKey: "ageRangeId",
        onDelete: "CASCADE",
      });
    }
  }
  ageRange.init(
    {
      range: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ageRange",
    }
  );
  return ageRange;
};
