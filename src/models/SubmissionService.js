import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Resident from "./Resident.js";
import Service from "./Service.js";

const SubmissionService = db.define(
  "submission_services",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    resident_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_submission: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    is_signed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status_submission: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    note: {
      type: DataTypes.TEXT,
      comment: "If the submission is rejected.",
    },
    submission_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    submission_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

SubmissionService.belongsTo(Resident, {
  foreignKey: "resident_id",
  as: "resident",
  onDelete: "RESTRICT",
});
SubmissionService.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
  onDelete: "RESTRICT",
});

export default SubmissionService;
