import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Role from "./Role.js";
import Resident from "./Resident.js";

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    temp_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    role_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resident_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
  onDelete: "RESTRICT",
});
User.belongsTo(Resident, {
  foreignKey: "resident_id",
  as: "resident",
  onDelete: "RESTRICT",
});

export default User;
