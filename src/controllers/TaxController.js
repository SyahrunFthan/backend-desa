import { Op } from "sequelize";
import Tax from "../models/Tax.js";
import Resident from "../models/Resident.js";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      reference_number,
      resident_id,
      taxpayer_name,
      taxpayer_address,
      status,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(reference_number && { reference_number }),
      ...(resident_id && {
        [Op.or]: [
          { "$resident.fullname$": { [Op.like]: `%${resident_id}%` } },
          { "$resident.nik$": { [Op.like]: `%${resident_id}%` } },
        ],
      }),
      ...(taxpayer_name && {
        taxpayer_name: { [Op.like]: `%${taxpayer_name}%` },
      }),
      ...(taxpayer_address && {
        taxpayer_address: { [Op.like]: `%${taxpayer_address}%` },
      }),
      ...(status && { status }),
    };

    const { count: total, rows: taxes } = await Tax.findAndCountAll({
      include: [
        {
          model: Resident,
          as: "resident",
          foreignKey: "resident_id",
        },
      ],
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const residents = await Resident.findAll({
      order: [["fullname", "ASC"]],
    });

    return res.status(200).json({ total, taxes, residents });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await Tax.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Tax.findByPk(id);
    if (!tax)
      return res.status(404).json({ messgae: res.__("message.notFound") });

    await tax.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Tax.findByPk(id);
    if (!tax)
      return res.status(404).json({ messgae: res.__("message.notFound") });

    await tax.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
