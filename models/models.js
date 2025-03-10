module.exports = (sequelize, DataTypes) => {
  const Data = sequelize.define(
    "Data",
    {
      id: {
        type: DataTypes.INTEGER, // 숫자 타입
        allowNull: false, // null 값 불가
        primaryKey: true, // 기본 키로 지정
        autoIncrement: true, // 자동 증가 설정
      },
      title: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Category",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      imgsrc: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "User",
          key: "email",
        },
        onDelete: "CASCADE",
      },
      likecnt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //  한글 저장
      freezeTableName: true,
    }
  );
  Data.associate = (db) => {
    Data.belongsTo(db.Category, {
      foreignKey: "categoryId", // 외래 키
      onDelete: "CASCADE", // 카테고리가 삭제되면 관련 데이터 삭제
    });

    Data.belongsTo(db.User, {
      foreignKey: "email",
      targetKey: "email",
      onDelete: "CASCADE",
    });
  };

  return Data;
};
