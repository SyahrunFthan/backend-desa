import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Resident from "./Resident.js";
import StallCategory from "./StallCategory.js";

const Stall = db.define(
  "stalls",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    resident_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Stall.belongsTo(Resident, {
  foreignKey: "resident_id",
  as: "resident",
  onDelete: "RESTRICT",
});
Stall.belongsTo(StallCategory, {
  foreignKey: "category_id",
  as: "category",
  onDelete: "RESTRICT",
});

export default Stall;
