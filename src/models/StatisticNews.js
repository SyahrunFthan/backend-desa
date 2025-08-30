import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import News from "./News.js";

const StatisticNews = db.define(
  "statistic_news",
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
    total_view: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    },
    total_share: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

StatisticNews.belongsTo(News, {
  foreignKey: "news_id",
  as: "news",
  onDelete: "cascade",
});
News.hasMany(StatisticNews, {
  foreignKey: "news_id",
  as: "statistic_news",
});

export default StatisticNews;
