// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      age: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imgsrc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      vUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      social: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      followCnt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      followerCnt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      freezeTableName: true,
    }
  );

  // 관계 설정 (필요하면 여기서 추가)
  User.associate = (db) => {
    User.hasMany(db.Like);
    User.hasMany(db.Data, {
      foreignKey: "email",
      sourceKey: "email",
      as: "Data",
    });
  };

  return User;
};
