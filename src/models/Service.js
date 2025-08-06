import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const Service = db.define(
  "services",
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
    type_service: {
      type: DataTypes.ENUM("general", "resident", "wedding", "land", "other"),
      allowNull: false,
    },
    status_service: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    template_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    template_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Service;
