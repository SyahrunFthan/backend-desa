import { Op } from "sequelize";
import Region from "../models/Region.js";
import Employee from "../models/Employee.js";
import Facility from "../models/Facility.js";
import Resident from "../models/Resident.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, search } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(search && { name: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows } = await Region.findAndCountAll({
      include: [
        {
          model: Employee,
          as: "leader",
          foreignKey: "leader_id",
        },
      ],
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const leaders = await Employee.findAll({
      where: {
        level: 0,
      },
      order: [["fullname", "ASC"]],
    });

    const regions = await Region.findAll();

    return res.status(200).json({ total, regions, leaders, rows });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, page_size = 5, search } = req.query;
    const region = await Region.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "leader",
          foreignKey: "leader_id",
        },
      ],
    });
    if (!region)
      return res.status(404).json({ message: res.__("message.notFound") });

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const whereClause = {
      ...(search && { name: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows: facilities } = await Facility.findAndCountAll({
      where: {
        region_id: id,
        ...whereClause,
      },
      limit,
      offset,
      order: [["name", "ASC"]],
    });

    const totalResident = await Resident.count({
      where: {
        region_id: id,
      },
    });

    return res.status(200).json({ region, total, facilities, totalResident });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await Region.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findByPk(id);
    if (!region)
      return res.status(404).json({ message: res.__("message.notFound") });

    await region.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findByPk(id);
    if (!region)
      return res.status(404).json({ message: res.__("message.notFound") });

    await region.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
