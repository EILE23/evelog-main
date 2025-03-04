module.exports = (sequelize, DataTypes) => {
  const data = sequelize.define(
    "Data",
    {
      id: {
        type: DataTypes.INTEGER, // 숫자 타입
        allowNull: false, // null 값 불가
        primaryKey: true, // 기본 키로 지정
        autoIncrement: true, // 자동 증가 설정
      },
      userid: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수 (NotNull)
        unique: true, // 고유 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //  한글 저장
      freezeTableName: true,
    }
  );
  data.associate = (db) => {};

  return data;
};
