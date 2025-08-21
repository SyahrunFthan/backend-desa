import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const Development = db.define(
  "developments",
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
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    source_of_fund: {
      type: DataTypes.STRING,
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
    start_at: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_at: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("process", "start", "finish"),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Development;
