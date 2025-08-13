import { Op } from "sequelize";
import AssistanceCategory from "../models/AssistanceCategory.js";
import Resident from "../models/Resident.js";
import SocialAssistance from "../models/SocialAssistance.js";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      resident_id,
      assistance_id,
      month_of_aid,
      receipt_at,
      status_assistance,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(resident_id && {
        [Op.or]: [
          { "$resident.fullname$": { [Op.like]: `%${resident_id}%` } },
          { "$resident.resident_id$": { [Op.like]: `%${resident_id}%` } },
        ],
      }),
      ...(assistance_id && { assistance_id }),
      ...(month_of_aid && { month_of_aid }),
      ...(receipt_at && { receipt_at }),
      ...(status_assistance && { status_assistance }),
    };

    const { count: total, rows: socialAssistances } =
      await SocialAssistance.findAndCountAll({
        include: [
          {
            model: Resident,
            as: "resident",
            foreignKey: "resident_id",
          },
          {
            model: AssistanceCategory,
            as: "assistance",
            foreignKey: "assistance_id",
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
    const assistanceCategories = await AssistanceCategory.findAll({
      where: {
        status: "active",
      },
      order: [["name", "ASC"]],
    });

    return res
      .status(200)
      .json({ total, socialAssistances, residents, assistanceCategories });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await SocialAssistance.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const socialAssistance = await SocialAssistance.findByPk(id);
    if (!socialAssistance)
      return res.status(404).json({ message: res.__("message.notFound") });

    await socialAssistance.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const socialAssistance = await SocialAssistance.findByPk(id);
    if (!socialAssistance)
      return res.status(404).json({ message: res.__("message.notFound") });

    await socialAssistance.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
