import { Op } from "sequelize";
import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Resident from "../models/Resident.js";

export const index = async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, page_size = 10, username, email } = req.query;

    const limit = Number(page_size);
    const offset = (Number(page) - 1) * limit;

    const whereClause = {};

    if (username) {
      whereClause.username = { [Op.like]: `%${username}%` };
    }

    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` };
    }

    const { rows: response, count: total } = await User.findAndCountAll({
      include: {
        model: Role,
        as: "role",
        foreignKey: "role_id",
      },
      limit: limit,
      order: [["createdAt", "desc"]],
      where: {
        ...whereClause,
        id: { [Op.ne]: userId },
      },
      offset,
    });

    const roles = await Role.findAll({ attributes: ["id", "name"] });
    const residents = await Resident.findAll({
      attributes: ["id", "fullname"],
    });

    return res.status(200).json({ response, total, roles, residents });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  const { password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: res.__("message.notFound") });

    await user.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: res.__("message.notFound") });

    await user.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
