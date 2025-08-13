import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const AssistanceCategory = db.define(
  "assistance_categories",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    type_assistance: {
      type: DataTypes.ENUM("cash", "basic good"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    year: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default AssistanceCategory;
