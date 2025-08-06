import { DataTypes } from "sequelize";
import db from "../configs/Database.js";

const IncomingLetter = db.define(
  "incoming_letters",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    date_of_letter: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    date_of_receipt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regarding: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_letter: {
      type: DataTypes.ENUM("read", "unread", "archived"),
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

export default IncomingLetter;
