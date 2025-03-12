"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      parentid: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Comments", // 자기 자신을 참조 (대댓글)
          key: "id",
        },
        onDelete: "CASCADE",
      },
      postid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Data", // 게시글 테이블 참조
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "User", // 유저 테이블 참조
          key: "id",
        },
        onDelete: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments");
  },
};
