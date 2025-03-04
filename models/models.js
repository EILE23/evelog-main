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
      category: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수 (NotNull)
        unique: true, // 고유 값
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
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
