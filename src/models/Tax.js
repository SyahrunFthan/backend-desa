import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Resident from "./Resident.js";

const Tax = db.define(
  "taxes",
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
    reference_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxpayer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxpayer_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    land_area: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    building_area: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("paid", "unpaid"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Tax.belongsTo(Resident, {
  foreignKey: "resident_id",
  as: "resident",
  onDelete: "CASCADE",
});

export default Tax;
