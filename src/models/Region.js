import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Employee from "./Employee.js";

const Region = db.define(
  "regions",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    leader_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    geo_json: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    land_area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Region.belongsTo(Employee, {
  foreignKey: "leader_id",
  as: "leader",
  onDelete: "restrict",
});

export default Region;
