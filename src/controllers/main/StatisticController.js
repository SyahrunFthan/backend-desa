import { Op, Sequelize } from "sequelize";
import Resident from "../../models/Resident.js";

export const getStatisticResident = async (req, res) => {
  try {
    const { page = 1, page_size = 10, search } = req.query;
    const limit = Number(page_size);
    const offset = (Number(page) - 1) * limit;

    const where = {
      ...(search && {
        [Op.or]: [
          {
            fullname: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            resident_id: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      }),
    };

    const [list, stats] = await Promise.all([
      Resident.findAndCountAll({
        where,
        limit,
        offset,
        order: [["resident_id", "ASC"]],
      }),
      Resident.findOne({
        attributes: [
          [
            Sequelize.fn("COUNT", Sequelize.col("resident_id")),
            "totalResident",
          ],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal("CASE WHEN gender='male' THEN 1 ELSE 0 END")
            ),
            "male",
          ],
          [
            Sequelize.fn(
              "SUM",
              Sequelize.literal("CASE WHEN gender='female' THEN 1 ELSE 0 END")
            ),
            "female",
          ],
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.fn("DISTINCT", Sequelize.col("family_card_id"))
            ),
            "totalLeader",
          ],
        ],
        raw: true,
      }),
    ]);

    const male = Number(stats.male || 0);
    const female = Number(stats.female || 0);
    const totalResident = Number(stats.totalResident || 0);
    const totalLeader = Number(stats.totalLeader || 0);

    return res.status(200).json({
      total: list.count,
      residents: list.rows,
      male,
      female,
      totalResident,
      totalLeader,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const getStatisticJob = async (req, res) => {
  try {
    const totalResident = await Resident.count();

    const totalWork = await Resident.count({
      where: { profesion_status: true },
    });

    const totalNotWork = await Resident.count({
      where: {
        [Op.or]: [{ profesion_status: false }],
      },
    });

    const rows = await Resident.findAll({
      attributes: [
        [Sequelize.fn("COALESCE", Sequelize.col("profesion")), "job"],
        [Sequelize.fn("COUNT", Sequelize.col("profesion")), "total"],
      ],
      where: { profesion_status: true },
      group: ["job"],
      order: [[Sequelize.literal("total"), "DESC"]],
      raw: true,
    });

    const jobStatsArr = rows.map((r) => ({
      job: r.job,
      total: Number(r.total),
    }));

    return res.status(200).json({
      jobStatsArr,
      totalResident,
      totalNotWork,
      totalWork,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const getStatisticGender = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: res.__("message.error") });
  }
};
