import AssistanceCategory from "../../models/AssistanceCategory.js";
import Resident from "../../models/Resident.js";
import SocialAssistance from "../../models/SocialAssistance.js";

export const index = async (req, res) => {
  try {
    const { search } = req.query;
    const response = await SocialAssistance.findAll({
      include: [
        {
          model: Resident,
          as: "resident",
          foreignKey: "resident_id",
          where: {
            resident_id: search,
          },
        },
        {
          model: AssistanceCategory,
          as: "assistance",
          foreignKey: "assistance_id",
        },
      ],
    });
    if (!response || response.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
