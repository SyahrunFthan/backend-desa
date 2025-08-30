import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import News from "./News.js";
import User from "./User.js";

const CommentNews = db.define(
  "comment_news",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    news_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

CommentNews.belongsTo(News, {
  foreignKey: "news_id",
  as: "news",
  onDelete: "cascade",
});
CommentNews.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "cascade",
});
News.hasMany(CommentNews, {
  foreignKey: "news_id",
  as: "comment_news",
});

export default CommentNews;
