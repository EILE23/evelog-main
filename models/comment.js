module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "Comments",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      parentid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Comments", key: "id" },
        onDelete: "CASCADE",
      },
      postid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Data", key: "id" },
        onDelete: "CASCADE",
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" },
        onDelete: "CASCADE",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "Comments",
      charset: "utf8",
      collate: "utf8_general_ci", //  한글 저장
      freezeTableName: true,
      timestamps: true,
    }
  );
  Comments.associate = (models) => {
    Comments.belongsTo(models.Data, {
      foreignKey: "postid",
      onDelete: "CASCADE",
    });
    Comments.belongsTo(models.User, {
      foreignKey: "userid",
      onDelete: "CASCADE",
    });
    Comments.hasMany(models.Comments, {
      as: "replies",
      foreignKey: "parentid",
    });
  };

  return Comments;
};
