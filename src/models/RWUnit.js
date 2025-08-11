import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const RWUnit = db.define(
  "rw_units",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name_of_chairman: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default RWUnit;
