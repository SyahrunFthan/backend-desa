import { Op } from "sequelize";
import FamilyCard from "../models/FamilyCard.js";
import Resident from "../models/Resident.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, family_id, address } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const whereClause = {};
    if (family_id) {
      whereClause.family_id = { [Op.like]: `%${family_id}%` };
    }

    if (address) {
      whereClause.address = { [Op.like]: `%${address}%` };
    }

    const { rows: response, count: total } = await FamilyCard.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Resident,
          as: "residents",
          foreignKey: "family_card_id",
        },
      ],
    });

    return res.status(200).json({ response, total });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, page_size = 5 } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const familyCard = await FamilyCard.findByPk(id);

    if (!familyCard)
      return res.status(404).json({ message: res.__("message.not_found") });

    const { count: total, rows: residents } = await Resident.findAndCountAll({
      include: {
        model: FamilyCard,
        as: "family_card",
        foreignKey: "family_card_id",
      },
      where: {
        family_card_id: id,
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ residents, familyCard, total });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await FamilyCard.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const familyCard = await FamilyCard.findByPk(id);

    if (!familyCard)
      return res.status(404).json({ message: res.__("message.notFound") });

    await familyCard.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const familyCard = await FamilyCard.findByPk(id);
    if (!familyCard)
      return res.status(404).json({ message: res.__("message.notFound") });

    await familyCard.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
