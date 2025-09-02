import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import SubmissionService from "../models/SubmissionService.js";
import Resident from "../models/Resident.js";
import Service from "../models/Service.js";
import Employee from "../models/Employee.js";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      code,
      resident_id,
      service_id,
      date_of_submission,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(code && { code: { [Op.like]: `%${code}%` } }),
      ...(service_id && { "$service.name$": { [Op.like]: `%${service_id}%` } }),
      ...(date_of_submission && { date_of_submission }),
      ...(resident_id && {
        [Op.or]: [
          {
            "$resident.resident_id$": {
              [Op.like]: `%${resident_id}%`,
            },
          },
          {
            "$resident.fullname$": {
              [Op.like]: `%${resident_id}%`,
            },
          },
        ],
      }),
    };

    const { count: total, rows: submissions } =
      await SubmissionService.findAndCountAll({
        where: {
          status_submission: "pending",
          ...where,
        },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Resident,
            foreignKey: "resident_id",
            as: "resident",
          },
          {
            model: Service,
            as: "service",
            foreignKey: "service_id",
          },
        ],
      });

    return res.status(200).json({ total, submissions });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const submissionService = await SubmissionService.findByPk(id, {
      include: [
        {
          model: Resident,
          foreignKey: "resident_id",
          as: "resident",
        },
        {
          model: Service,
          as: "service",
          foreignKey: "service_id",
        },
      ],
    });
    if (!submissionService)
      return res.status(404).json({ message: res.__("message.notFound") });

    const employees = await Employee.findAll({
      where: {
        level: {
          [Op.ne]: 0,
        },
        signature_file: {
          [Op.ne]: null,
        },
      },
    });

    return res.status(200).json({ submissionService, employees });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const getHistory = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      code,
      resident_id,
      service_id,
      date_of_submission,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(code && { code: { [Op.like]: `%${code}%` } }),
      ...(service_id && { "$service.name$": { [Op.like]: `%${service_id}%` } }),
      ...(date_of_submission && { date_of_submission }),
      ...(resident_id && {
        [Op.or]: [
          {
            "$resident.resident_id$": {
              [Op.like]: `%${resident_id}%`,
            },
          },
          {
            "$resident.fullname$": {
              [Op.like]: `%${resident_id}%`,
            },
          },
        ],
      }),
    };

    const { count: total, rows: submissions } =
      await SubmissionService.findAndCountAll({
        where: {
          status_submission: {
            [Op.ne]: "pending",
          },
          ...where,
        },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Resident,
            foreignKey: "resident_id",
            as: "resident",
          },
          {
            model: Service,
            as: "service",
            foreignKey: "service_id",
          },
        ],
      });

    return res.status(200).json({ total, submissions });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    const resident = await Resident.findOne({
      where: {
        resident_id: req.body.resident_id,
      },
    });

    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedTypes = [".docx", ".doc", ".pdf"];

    if (!allowedTypes.includes(ext.toLowerCase()))
      return res
        .status(422)
        .json({ file: res.__("submissionService.file.type") });

    if (fileSize > 1024 * 1024 * 3)
      return res
        .status(422)
        .json({ file: res.__("submissionService.file.size") });

    const filename = Date.now() + ext;
    const filepath = `${req.protocol}://${req.get(
      "host"
    )}/public/submission-services/${filename}`;

    await file.mv(`public/submission-services/${filename}`);

    await SubmissionService.create({
      ...req.body,
      resident_id: resident.id,
      submission_file: filename,
      submission_path: filepath,
    });

    return res.status(200).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const submissionService = await SubmissionService.findByPk(id);
    if (!submissionService)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = submissionService.submission_file;
    let filepath = submissionService.submission_path;

    if (req.files) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".docx", ".doc", ".pdf"];

      if (!allowedTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ file: res.__("submissionService.file.type") });

      if (fileSize > 1024 * 1024 * 3)
        return res
          .status(422)
          .json({ file: res.__("submissionService.file.size") });
      if (submissionService.submission_file !== null) {
        fs.unlinkSync(
          `public/submission-services/${submissionService.submission_file}`
        );
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/submission-services/${filename}`;

      await file.mv(`public/submission-services/${filename}`);
    }

    await submissionService.update({
      ...req.body,
      submission_file: filename,
      submission_path: filepath,
    });

    return res.status(200).json({ message: res.__("message.success") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const submissionService = await SubmissionService.findByPk(id);
    if (!submissionService)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = submissionService.submission_file;
    let filepath = submissionService.submission_path;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const ext = path.extname(file.name);
      const allowedTypes = [".pdf"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ file: res.__("submissionService.file.type") });
      if (submissionService.submission_file !== null) {
        fs.unlinkSync(
          `public/submission-services/${submissionService.submission_file}`
        );
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/submission-services/${filename}`;

      await file.mv(`public/submission-services/${filename}`);
    }

    await submissionService.update({
      ...req.body,
      submission_file: filename,
      submission_path: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const submissionService = await SubmissionService.findByPk(id);
    if (!submissionService)
      return res.status(404).json({ message: res.__("message.notFound") });

    if (submissionService.submission_file !== null) {
      fs.unlinkSync(
        `public/submission-services/${submissionService.submission_file}`
      );
    }

    await submissionService.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
