import { Op, where } from "sequelize";
import path from "path";
import fs from "fs";
import News from "../models/News.js";
import db from "../configs/Database.js";
import StatisticNews from "../models/StatisticNews.js";
import CommentNews from "../models/CommentNews.js";
import User from "../models/User.js";
import Resident from "../models/Resident.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, search } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(search && { title: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows: news } = await News.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ total, news });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news)
      return res.status(404).json({ message: res.__("message.notFound") });

    const { page = 1, page_size = 5, search } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const whereClause = {
      ...(search && {
        [Op.or]: [
          {
            "$news.title$": {
              [Op.like]: `%${search}%`,
            },
          },
          {
            "$user.resident.fullname$": {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      }),
    };

    const [statistic, { count: total, rows: comment_news }] = await Promise.all(
      [
        StatisticNews.findOne({
          where: {
            news_id: id,
          },
        }),
        CommentNews.findAndCountAll({
          where: {
            news_id: id,
            ...whereClause,
          },
          limit,
          offset,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: News,
              as: "news",
              foreignKey: "news_id",
            },
            {
              model: User,
              as: "user",
              foreignKey: "user_id",
              include: [
                {
                  model: Resident,
                  as: "resident",
                  foreignKey: "resident_id",
                },
              ],
            },
          ],
        }),
      ]
    );

    return res.status(200).json({ statistic, total, comment_news, news });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    let filename = "activity.png";
    let filepath = `${req.protocol}://${req.get("host")}/public/${filename}`;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("news.file.type") });
      if (fileSize > 1024 * 1024 * 3)
        return res.status(422).json({ file: res.__("news.file.size") });

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get("host")}/public/news/${filename}`;

      await file.mv(`public/news/${filename}`);
    }

    db.transaction(async (t) => {
      const news = await News.create(
        {
          ...req.body,
          image: filename,
          path_image: filepath,
        },
        {
          transaction: t,
        }
      );

      await StatisticNews.create(
        {
          news_id: news.id,
          total_view: 0,
          total_share: 0,
        },
        {
          transaction: t,
        }
      );
    });

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = news.image;
    let filepath = news.path_image;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("news.file.type") });
      if (fileSize > 1024 * 1024 * 3)
        return res.status(422).json({ file: res.__("news.file.size") });
      if (news.image !== "activity.png") {
        fs.unlinkSync(`public/news/${news.image}`);
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get("host")}/public/news/${filename}`;

      await file.mv(`public/news/${filename}`);
    }

    await news.update({
      ...req.body,
      image: filename,
      path_image: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news)
      return res.status(404).json({ message: res.__("message.notFound") });

    if (news.image !== "activity.png") {
      fs.unlinkSync(`public/news/${news.image}`);
    }

    await news.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
