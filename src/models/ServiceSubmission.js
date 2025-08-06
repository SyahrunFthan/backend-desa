import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Resident from "./Resident.js";
import Service from "./Service.js";

const ServiceSubmission = db.define(
  "service_submissions",
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

ServiceSubmission.belongsTo(Resident, {
  foreignKey: "resident_id",
  as: "resident",
  onDelete: "RESTRICT",
});
ServiceSubmission.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
  onDelete: "RESTRICT",
});

export default ServiceSubmission;
