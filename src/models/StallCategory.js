import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const StallCategory = db.define(
  "stall_categories",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default StallCategory;
