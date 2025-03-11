"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // users 테이블을 생성
    await queryInterface.createTable("like", {
      id: {
        type: Sequelize.INTEGER, // 컬럼 타입 설정
        allowNull: false, // 필수값 (NOT NULL)
        primaryKey: true, // 기본 키 지정
        autoIncrement: true, // 자동 증가 설정
      },
      postid: {
        type: Sequelize.INTEGER,
        allowNull: false, // 필수값
        unique: true, // 고유값
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 테이블을 삭제
    await queryInterface.dropTable("like");
  },
};
