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
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      freezeTableName: true,
    }
  );

  // 관계 설정 (필요하면 여기서 추가)
  Like.associate = (db) => {
    Like.belongsTo(db.User, { foreignKey: "userid" });
    // 예시: Like.belongsTo(db.Post, { foreignKey: 'postid' });
  };

  return Like;
};
