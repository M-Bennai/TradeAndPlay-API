"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      title: {
        type: Sequelize.STRING,
      },
      condition: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      trade: {
        type: Sequelize.BOOLEAN,
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        reference: {
          model: "User",
          key: "id",
          as: "userId",
        },
      },
      categoryId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        reference: {
          model: "Category",
          key: "id",
          as: "categoryId",
        },
      },
      valueId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        reference: {
          model: "Value",
          key: "id",
          as: "valueId",
        },
      },
      ageRangeId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        reference: {
          model: "AgeRange",
          key: "id",
          as: "ageRangeId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Articles");
  },
};
