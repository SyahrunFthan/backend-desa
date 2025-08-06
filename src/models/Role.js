import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const Role = db.define(
  "roles",
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
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "admin | user",
    },
  },
  {
    freezeTableName: true,
  }
);

export default Role;
