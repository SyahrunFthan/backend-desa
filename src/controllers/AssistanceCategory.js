import { Op } from "sequelize";
import AssistanceCategory from "../models/AssistanceCategory.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, search } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(search && { name: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows: assistanceCategories } =
      await AssistanceCategory.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    return res.status(200).json({ total, assistanceCategories });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await AssistanceCategory.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const assistanceCategory = await AssistanceCategory.findByPk(id);
    if (!assistanceCategory)
      return res.status(404).json({ message: res.__("message.notFound") });

    await assistanceCategory.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const assistanceCategory = await AssistanceCategory.findByPk(id);
    if (!assistanceCategory)
      return res.status(404).json({ message: res.__("message.notFound") });

    await assistanceCategory.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
