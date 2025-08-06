import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Resident from "./Resident.js";
import AssistanceCategory from "./AssistanceCategory.js";

const SocialAssistance = db.define(
  "social_assistances",
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
    assistance_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_assistance: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    freezeTableName: true,
  }
);

SocialAssistance.belongsTo(Resident, {
  foreignKey: "resident_id",
  as: "resident",
  onDelete: "restrict",
});
Resident.hasMany(SocialAssistance, {
  foreignKey: "resident_id",
  as: "social_assistances",
});
SocialAssistance.belongsTo(AssistanceCategory, {
  foreignKey: "assistance_id",
  as: "assistance",
  onDelete: "cascade",
});

export default SocialAssistance;
