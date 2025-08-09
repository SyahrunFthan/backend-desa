import { Op, Sequelize } from "sequelize";
import Income from "../models/Income.js";
import Period from "../models/Period.js";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      period_id,
      code,
      name,
      abbreviation,
      year,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(period_id && { period_id: period_id }),
      ...(code && { code: { [Op.like]: `%${code}%` } }),
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      ...(abbreviation && { abbreviation: abbreviation }),
      ...(year && { year: year }),
    };

    const { count: total, rows } = await Income.findAndCountAll({
      include: [
        {
          model: Period,
          foreignKey: "period_id",
          as: "period",
        },
      ],
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const periods = await Period.findAll({
      order: [["year", "DESC"]],
    });

    const statistics = await Income.findAll({
      attributes: [
        [Sequelize.col("period.year"), "year"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_income"],
      ],
      include: [
        {
          model: Period,
          attributes: [],
          as: "period",
        },
      ],
      group: ["period.year"],
      order: [[Sequelize.col("period.year"), "ASC"]],
    });

    return res.status(200).json({ total, rows, periods, statistics });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await Income.create(req.body);
    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findByPk(id);
    if (!income)
      return res.status(404).json({ message: res.__("message.notFound") });

    await income.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findByPk(id);
    if (!income)
      return res.status(404).json({ message: res.__("message.notFound") });

    await income.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
