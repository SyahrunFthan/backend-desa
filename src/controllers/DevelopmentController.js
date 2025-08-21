import { Op } from "sequelize";
import Development from "../models/Development.js";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      name,
      volume,
      source_of_fund,
      status,
      start_at,
      end_at,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      ...(volume && { volume: { [Op.like]: `%${volume}%` } }),
      ...(source_of_fund && {
        source_of_fund: { [Op.like]: `%${source_of_fund}%` },
      }),
      ...(status && { status }),
      ...(start_at && { start_at }),
      ...(end_at && { end_at }),
    };

    const { count: total, rows: developments } =
      await Development.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    return res.status(200).json({ total, developments });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await Development.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const development = await Development.findByPk(id);
    if (!development)
      return res.status(404).json({ message: res.__("message.notFound") });

    await development.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const development = await Development.findByPk(id);
    if (!development)
      return res.status(404).json({ message: res.__("message.notFound") });

    await development.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
