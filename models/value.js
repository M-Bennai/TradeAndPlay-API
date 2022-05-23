"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Value extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Value.hasMany(models.Article, {
        as: "article",
        foreignKey: "valueId",
        onDelete: "CASCADE",
      });
    }
  }
  Value.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Value",
    }
  );
  return Value;
};
