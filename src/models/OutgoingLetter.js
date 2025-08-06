import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const OutgoingLetter = db.define(
  "outgoing_letters",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_letter: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    objective: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regarding: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_letter: {
      type: DataTypes.ENUM("archived", "sending", "process"),
      allowNull: false,
      defaultValue: "archived",
    },
    letter_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    letter_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default OutgoingLetter;
