"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Data", "userId", {
      type: Sequelize.TEXT,
      allowNull: true, // 빈 값 허용
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Data", "userId");
  },
};
