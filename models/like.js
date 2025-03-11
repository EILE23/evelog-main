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
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      freezeTableName: true,
      timestamps: false,
    }
  );

  // 관계 설정 (필요하면 여기서 추가)
  Like.associate = (db) => {
    Like.belongsTo(db.User, { foreignKey: "userid" });
    // 예시: Like.belongsTo(db.Post, { foreignKey: 'postid' });
  };

  return Like;
};
