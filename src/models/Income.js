import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Period from "./Period.js";

const Income = db.define(
  "incomes",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    period_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Ex: ADD",
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Income.belongsTo(Period, {
  foreignKey: "period_id",
  as: "period",
  onDelete: "CASCADE",
});
Period.hasMany(Income, {
  foreignKey: "period_id",
  as: "incomes",
});

export default Income;
