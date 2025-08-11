import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import RWUnit from "./RWUnit.js";

const RTUnit = db.define(
  "rt_units",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    rw_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_of_chairman: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

RTUnit.belongsTo(RWUnit, {
  foreignKey: "rw_id",
  as: "rw_unit",
  onDelete: "CASCADE",
});
RWUnit.hasMany(RTUnit, {
  foreignKey: "rw_id",
  as: "rt_units",
});

export default RTUnit;
