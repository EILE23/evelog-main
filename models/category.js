// models/category.js
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category", // 모델 이름 (첫 글자는 대문자)
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
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
  Category.associate = (db) => {
    Category.hasMany(db.Data);
  };

  return Category;
};
