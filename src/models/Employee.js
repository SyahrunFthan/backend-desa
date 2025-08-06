import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const Employee = db.define(
  "employees",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    religion: {
      type: DataTypes.ENUM(
        "islam",
        "christian",
        "catholic",
        "hinduism",
        "buddhism",
        "confucianism"
      ),
      allowNull: false,
    },
    place_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    is_structure: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    position: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: "default.png",
      allowNull: false,
    },
    path_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signature_file: {
      type: DataTypes.STRING,
    },
    signature_path: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Employee;
