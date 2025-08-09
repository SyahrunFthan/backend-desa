import { Op, Sequelize } from "sequelize";
import Expense from "../models/Expense.js";
import Period from "../models/Period.js";
import Income from "../models/Income.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, code, name, period_id } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(code && { code: { [Op.like]: `%${code}%` } }),
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      ...(period_id && { period_id }),
    };

    const { count: total, rows: expenses } = await Expense.findAndCountAll({
      include: [
        {
          model: Period,
          as: "period",
          foreignKey: "period_id",
        },
        {
          model: Income,
          as: "income",
          foreignKey: "funding_source_id",
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
    const fundingSources = await Income.findAll({
      order: [["abbreviation", "ASC"]],
    });
    const statistics = await Expense.findAll({
      attributes: [
        [Sequelize.col("period.year"), "year"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_expense"],
      ],
      include: [
        {
          model: Period,
          attributes: [],
          as: "period",
        },
      ],
      where: {
        is_main: true,
      },
      group: ["period.year"],
      order: [[Sequelize.col("period.year"), "ASC"]],
    });

    return res
      .status(200)
      .json({ total, expenses, periods, fundingSources, statistics });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    const { amount, unit } = req.body;

    const price = Number(amount);
    const unitPrice = Number(unit);

    const expenseAmount = price * unitPrice;

    await Expense.create({
      ...req.body,
      amount: expenseAmount,
    });

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, unit } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense)
      return res.status(404).json({ message: res.__("message.notFound") });

    const price = Number(amount);
    const unitPrice = Number(unit);

    const expenseAmount = price * unitPrice;

    await expense.update({ ...req.body, amount: expenseAmount });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense)
      return res.status(404).json({ message: res.__("message.notFound") });

    await expense.destroy();
    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
