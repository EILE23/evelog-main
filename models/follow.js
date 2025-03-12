module.exports = (sequelize, DataTypes) => {
  const Follows = sequelize.define(
    "Follows",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      targetid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" },
        onDelete: "CASCADE",
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Follows",
      charset: "utf8",
      collate: "utf8_general_ci", //  한글 저장
      freezeTableName: true,
      timestamps: true,
    }
  );
  Comments.associate = (models) => {
    Comments.belongsTo(models.Data, {
      foreignKey: "targetid",
      onDelete: "CASCADE",
    });
    Comments.belongsTo(models.User, {
      foreignKey: "userid",
      onDelete: "CASCADE",
    });
  };

  return Follows;
};
