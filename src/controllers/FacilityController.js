import { Op } from "sequelize";
import Facility from "../models/Facility.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, search } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(search && { name: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows: facilities } = await Facility.findAndCountAll({
      where,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ total, facilities });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await Facility.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByPk(id);
    if (!facility)
      return res.status(404).json({ message: res.__("message.notFound") });

    await facility.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByPk(id);
    if (!facility)
      return res.status(404).json({ message: res.__("message.notFound") });

    await facility.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
