// models/like.js
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      postid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Data",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      freezeTableName: true,
      timestamps: false,
    }
  );

  // 관계 설정
  Like.associate = (db) => {
    Like.belongsTo(db.User, {
      foreignKey: "userid",
      targetKey: "id",
      onDelete: "CASCADE",
    });
    Like.belongsTo(db.Data, {
      foreignKey: "postid",
      targetKey: "id",
      onDelete: "CASCADE",
    });
  };

  return Like;
};
