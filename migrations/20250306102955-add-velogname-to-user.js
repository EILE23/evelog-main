"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("User", "title", {
      type: Sequelize.TEXT,
      allowNull: false, // 빈 값 허용
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("User", "title");
  },
};
