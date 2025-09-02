import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import Region from "./Region.js";
import FamilyCard from "./FamilyCard.js";

const Resident = db.define(
  "residents",
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
    family_card_id: {
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
    citizen_status: {
      type: DataTypes.ENUM("mutation", "local citizen"),
      allowNull: false,
      defaultValue: "local citizen",
    },
    place_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    family_status: {
      type: DataTypes.ENUM("father", "mother", "child"),
      allowNull: false,
    },
    profesion_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    profesion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    region_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    path_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Resident.belongsTo(Region, {
  foreignKey: "region_id",
  as: "region",
  onDelete: "set null",
});
Resident.belongsTo(FamilyCard, {
  foreignKey: "family_card_id",
  as: "family_card",
  onDelete: "restrict",
});
FamilyCard.hasMany(Resident, {
  foreignKey: "family_card_id",
  as: "residents",
});

export default Resident;
