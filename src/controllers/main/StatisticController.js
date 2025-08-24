import { Op, Sequelize } from "sequelize";
import dayjs from "dayjs";
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
      where: { profesion_status: false },
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
    const [totalMale, totalFemale, totalResident] = await Promise.all([
      Resident.count({
        where: {
          gender: "male",
        },
      }),
      Resident.count({
        where: {
          gender: "female",
        },
      }),
      Resident.count(),
    ]);

    if (totalResident === 0) {
      return res.status(200).json({ result: [] });
    }

    const result = [
      {
        name: "Laki-Laki",
        value: totalResident ? (totalMale / totalResident) * 100 : 0,
        count: totalMale,
      },
      {
        name: "Perempuan",
        value: totalResident ? (totalFemale / totalResident) * 100 : 0,
        count: totalFemale,
      },
    ];

    return res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const getStatisticReligion = async (req, res) => {
  try {
    const totalResident = await Resident.count();
    const religions = [
      { name: "Islam", value: "islam" },
      { name: "Kristen", value: "christian" },
      { name: "Katolik", value: "catholic" },
      { name: "Hindu", value: "hinduism" },
      { name: "Buddha", value: "buddhism" },
      { name: "Konghucu", value: "confucianism" },
    ];

    const counts = await Promise.all(
      religions.map((r) =>
        Resident.count({
          where: {
            religion: r.value,
          },
        })
      )
    );

    const result = religions.map((r, index) => ({
      name: r.name,
      value: r.value,
      count: counts[index],
      percentage: totalResident
        ? parseFloat(((counts[index] / totalResident) * 100).toFixed(1))
        : 0,
    }));

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const getStatisticAgeGroup = async (req, res) => {
  try {
    const totalResident = await Resident.count();
    const ageGroups = [
      { ageRange: "0-4", category: "Balita", min: 0, max: 4 },
      { ageRange: "5-14", category: "Anak-anak", min: 5, max: 14 },
      { ageRange: "15-24", category: "Remaja", min: 15, max: 24 },
      { ageRange: "25-34", category: "Dewasa Muda", min: 25, max: 34 },
      { ageRange: "35-44", category: "Dewasa", min: 35, max: 44 },
      { ageRange: "45-54", category: "Dewasa", min: 45, max: 54 },
      { ageRange: "55-64", category: "Lansia Awal", min: 55, max: 64 },
      { ageRange: "65+", category: "Lansia", min: 65, max: 150 },
    ];

    const result = await Promise.all(
      ageGroups.map(async (g) => {
        const maxBirthYear = dayjs().subtract(g.min, "year").toDate();
        const minBirthYear = dayjs()
          .subtract(g.max + 1, "year")
          .toDate();

        const count = await Resident.count({
          where: {
            date_of_birth: {
              [Op.between]: [minBirthYear, maxBirthYear],
            },
          },
        });

        const male = await Resident.count({
          where: {
            gender: "male",
            date_of_birth: {
              [Op.between]: [minBirthYear, maxBirthYear],
            },
          },
        });

        const female = await Resident.count({
          where: {
            gender: "female",
            date_of_birth: {
              [Op.between]: [minBirthYear, maxBirthYear],
            },
          },
        });

        return {
          ageRange: g.ageRange,
          category: g.category,
          count,
          percentage: totalResident
            ? parseFloat(((count / totalResident) * 100).toFixed(1))
            : 0,
          male,
          female,
        };
      })
    );

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
