import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const Facility = db.define(
  "facilities",
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
    type_facility: {
      type: DataTypes.ENUM(
        "government",
        "health",
        "education",
        "house of worship",
        "social",
        "economy",
        "other"
      ),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Facility;
