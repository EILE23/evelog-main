"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Data", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "User",
        key: "email",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Data", "email");
  },
};
