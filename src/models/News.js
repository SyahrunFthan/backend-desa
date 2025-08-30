import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const News = db.define(
  "news",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_issue: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    path_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("publish", "unpublish"),
      defaultValue: "unpublish",
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default News;
