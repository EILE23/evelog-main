// migrations/20230304120000-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // users 테이블을 생성
    await queryInterface.createTable("User", {
      id: {
        type: Sequelize.INTEGER, // 컬럼 타입 설정
        allowNull: false, // 필수값 (NOT NULL)
        primaryKey: true, // 기본 키 지정
        autoIncrement: true, // 자동 증가 설정
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      nickname: {
        type: Sequelize.STRING, // 문자열 타입
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING, // 문자열 타입
        allowNull: false, // 필수값
        // 고유값
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING, // 문자열 타입
        allowNull: true, // 필수값
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE, // 생성일
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE, // 수정일
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 테이블을 삭제
    await queryInterface.dropTable("User");
  },
};
