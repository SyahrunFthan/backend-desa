import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const Village = db.define(
  "villages",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vission: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    mission: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    about: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    history: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    path_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    path_logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Village;
