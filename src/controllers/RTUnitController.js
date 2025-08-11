import { Op } from "sequelize";
import RTUnit from "../models/RTUnit.js";
import RWUnit from "../models/RWUnit.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, search } = req.query;
    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(search && { code: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows } = await RTUnit.findAndCountAll({
      include: [
        {
          model: RWUnit,
          as: "rw_unit",
          foreignKey: "rw_id",
        },
      ],
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const rw_units = await RWUnit.findAll({
      order: [["code", "ASC"]],
    });

    return res.status(200).json({ total, rows, rw_units });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await RTUnit.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await RTUnit.findByPk(id);
    if (!unit)
      return res.status(404).json({ message: res.__("message.notFound") });

    await unit.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await RTUnit.findByPk(id);
    if (!unit)
      return res.status(404).json({ message: res.__("message.notFound") });

    await unit.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
