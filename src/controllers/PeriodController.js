import Period from "../models/Period.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, year } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(year && { year: year }),
    };

    const { count: total, rows } = await Period.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    const periods = await Period.findAll();

    return res.status(200).json({ periods, total, rows });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const showWithIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const period = await Period.findByPk(id);
    if (!period)
      return res.status(404).json({ message: res.__("message.not_found") });

    const { page = 1, page_size = 5, code, name, abbreviation } = req.query;
    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(code && { code: { [Op.like]: `%${code}%` } }),
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      ...(abbreviation && { abbreviation: { [Op.like]: `%${abbreviation}%` } }),
      period_id: id,
    };

    const { count: total, rows: incomes } = await Income.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ total, incomes });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const showWithExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const period = await Period.findByPk(id);
    if (!period)
      return res.status(404).json({ message: res.__("message.not_found") });

    const { page = 1, page_size = 5, code, name } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(code && { code: { [Op.like]: `%${code}%` } }),
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      period_id: id,
      is_main: true,
    };

    const { count: total, rows: expenses } = await Expense.findAndCountAll({
      include: [
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

    return res.status(200).json({ total, expenses });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await Period.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const period = await Period.findByPk(id);
    if (!period)
      return res.status(404).json({ message: res.__("message.notFound") });

    await period.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const upload = async (req, res) => {
  try {
    const { id } = req.params;
    const period = await Period.findByPk(id);
    if (!period)
      return res.status(404).json({ message: res.__("message.notFound") });

    const file = req.files.file;
    const filesize = file.data.length;
    const ext = path.extname(file.name);
    const allowedTypes = [".pdf"];
    if (!allowedTypes.includes(ext.toLowerCase()))
      return res.status(422).json({ message: res.__("periods.file.type") });
    if (filesize > 1024 * 1024 * 2)
      return res.status(422).json({ message: res.__("periods.file.size") });

    if (period.file !== null) {
      fs.unlinkSync(`public/periods/${period.file}`);
    }

    const filename = Date.now() + ext;
    const filepath = `${req.protocol}://${req.get(
      "host"
    )}/public/periods/${filename}`;

    await file.mv(`public/periods/${filename}`);

    await period.update({
      file: filename,
      path_file: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const period = await Period.findByPk(id);
    if (!period)
      return res.status(404).json({ message: res.__("message.notFound") });

    if (period.file !== null) {
      fs.unlinkSync(`public/periods/${period.file}`);
    }

    await period.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
