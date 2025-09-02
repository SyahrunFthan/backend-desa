import { Op } from "sequelize";
import Resident from "../models/Resident.js";
import FamilyCard from "../models/FamilyCard.js";
import Region from "../models/Region.js";
import path from "path";
import fs from "fs";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      resident_id,
      fullname,
      family_card_id,
      place_of_birth,
      date_of_birth,
      profesion,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(resident_id && { resident_id: { [Op.like]: `%${resident_id}%` } }),
      ...(fullname && { fullname: { [Op.like]: `%${fullname}%` } }),
      ...(place_of_birth && {
        place_of_birth: { [Op.like]: `%${place_of_birth}%` },
      }),
      ...(date_of_birth && { date_of_birth }),
      ...(profesion && { profesion: { [Op.like]: `%${profesion}%` } }),
    };

    const { count: total, rows: response } = await Resident.findAndCountAll({
      include: [
        {
          model: FamilyCard,
          as: "family_card",
          foreignKey: "family_card_id",
          where: family_card_id
            ? { family_id: { [Op.like]: `%${family_card_id}%` } }
            : undefined,
        },
        {
          model: Region,
          as: "region",
          foreignKey: "region_id",
        },
      ],
      order: [["createdAt", "DESC"]],
      where,
      limit,
      offset,
    });

    const regions = await Region.findAll({ attributes: ["id", "name"] });
    const familyCards = await FamilyCard.findAll({
      attributes: ["id", "family_id"],
    });

    let jobStats = {};
    const residents = await Resident.findAll();
    residents.forEach((resident) => {
      if (resident.profesion_status == true) {
        const job = resident.profesion;
        jobStats[job] = (jobStats[job] || 0) + 1;
      }
    });

    const profesions = Object.entries(jobStats).map(([job, total]) => ({
      job,
      total,
    }));

    const religions = [
      "islam",
      "christian",
      "catholic",
      "hinduism",
      "buddhism",
      "confucianism",
    ];

    const religionLabels = {
      islam: "Islam",
      christian: "Kristen",
      catholic: "Katolik",
      hinduism: "Hindu",
      buddhism: "Buddha",
      confucianism: "Konghuchu",
    };

    const religionData = religions.map((religion) => ({
      name: religionLabels[religion],
      total: residents.filter((r) => r.religion === religion).length,
    }));

    return res.status(200).json({
      regions,
      familyCards,
      response,
      total,
      profesions,
      religionData,
    });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    let filename = "default.png";
    let path_image = `${req.protocol}://${req.get("host")}/public/${filename}`;

    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      filename = Date.now() + ext;

      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("residents.file.type") });

      if (fileSize > 2000000)
        return res.status(422).json({ file: res.__("residents.file.size") });

      path_image = `${req.protocol}://${req.get(
        "host"
      )}/public/residents/${filename}`;

      await file.mv(`public/residents/${filename}`);
    }

    await Resident.create({
      ...req.body,
      image: filename,
      path_image: path_image,
    });

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const resident = await Resident.findByPk(id);
    if (!resident)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = "default.png";
    let path_image = `${req.protocol}://${req.get("host")}/public/${filename}`;

    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("residents.file.types") });

      if (fileSize > 2000000)
        return res.status(422).json({ file: res.__("residents.file.size") });

      if (resident.image !== "default.png") {
        fs.unlinkSync(`public/residents/${resident.image}`);
      }

      filename = Date.now() + ext;
      path_image = `${req.protocol}://${req.get(
        "host"
      )}/public/residents/${filename}`;

      await file.mv(`public/residents/${filename}`);
    }

    await resident.update({
      ...req.body,
      profesion: req.body.profesion !== "null" ? req.body.profesion : null,
      image: filename,
      path_image: path_image,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const resident = await Resident.findByPk(id);
    if (!resident)
      return res.status(404).json({ message: res.__("message.notFound") });

    if (resident.image !== "default.png") {
      fs.unlinkSync(`public/residents/${resident.image}`);
    }

    await resident.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
