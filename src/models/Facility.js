import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Region from "./Region.js";

const Facility = db.define(
  "facilities",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    region_id: {
      type: DataTypes.STRING,
      allowNull: true,
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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    path_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Facility.belongsTo(Region, {
  foreignKey: "region_id",
  as: "region",
  onDelete: "set null",
});
Region.hasMany(Facility, {
  foreignKey: "region_id",
  as: "facilities",
});

export default Facility;
