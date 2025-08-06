import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Income from "./Income.js";
import Period from "./Period.js";

const Expense = db.define(
  "expenses",
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
    volume: {
      type: DataTypes.INTEGER,
    },
    unit: {
      type: DataTypes.INTEGER,
    },
    funding_source_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    is_main: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: "Ex: Point Utama",
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

Expense.belongsTo(Income, {
  foreignKey: "funding_source_id",
  as: "income",
  onDelete: "CASCADE",
});
Expense.belongsTo(Period, {
  foreignKey: "period_id",
  as: "period",
  onDelete: "CASCADE",
});
Period.hasMany(Expense, {
  foreignKey: "period_id",
  as: "expenses",
});

export default Expense;
