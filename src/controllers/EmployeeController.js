import { Op } from "sequelize";
import Employee from "../models/Employee.js";
import path from "path";
import fs from "fs";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      employee_id,
      fullname,
      gender,
      religion,
      date_of_birth,
      position,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(employee_id && { employee_id: { [Op.like]: `%${employee_id}%` } }),
      ...(fullname && { fullname: { [Op.like]: `%${fullname}%` } }),
      ...(gender && { gender: gender }),
      ...(religion && { religion: religion }),
      ...(date_of_birth && { date_of_birth: date_of_birth }),
      ...(position && { position: { [Op.like]: `%${position}%` } }),
    };

    const { count: total, rows: employees } = await Employee.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ total, employees });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    const { employee_id } = req.body;

    let filename = "default.png";
    let filepath = `${req.protocol}://${req.get("host")}/public/${filename}`;

    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("employees.file.type") });
      if (filesize > 2000000)
        return res.status(422).json({ file: res.__("employees.file.size") });

      filename = Date.now() + "-" + employee_id + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/employees/${filename}`;

      await file.mv(`public/employees/${filename}`);
    }

    let signaturename = null;
    let signaturepath = null;
    if (req.files && req.files.signature) {
      const file = req.files.signature;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ signature: res.__("employees.file.type") });
      if (filesize > 2000000)
        return res
          .status(422)
          .json({ signature: res.__("employees.file.size") });

      signaturename = Date.now() + "-" + employee_id + ext;
      signaturepath = `${req.protocol}://${req.get(
        "host"
      )}/public/signatures/${signaturename}`;

      await file.mv(`public/signatures/${signaturename}`);
    }

    await Employee.create({
      ...req.body,
      image: filename,
      path_image: filepath,
      signature_file: signaturename,
      signature_path: signaturepath,
    });

    return res.status(201).json({ message: res.__("employees.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id } = req.body;
    const employee = await Employee.findByPk(id);

    if (!employee)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = employee.image;
    let filepath = employee.path_image;

    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("employees.file.type") });
      if (filesize > 2000000)
        return res.status(422).json({ file: res.__("employees.file.size") });

      filename = Date.now() + "-" + employee_id + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/employees/${filename}`;

      if (employee.image !== "default.png") {
        fs.unlinkSync(`public/employees/${employee.image}`);
      }

      await file.mv(`public/employees/${filename}`);
    }

    let signaturename = employee.signature_file;
    let signaturepath = employee.signature_path;
    if (req.files && req.files.signature) {
      const file = req.files.signature;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ signature: res.__("employees.file.type") });
      if (filesize > 2000000)
        return res
          .status(422)
          .json({ signature: res.__("employees.file.size") });

      signaturename = Date.now() + "-" + employee_id + ext;
      signaturepath = `${req.protocol}://${req.get(
        "host"
      )}/public/signatures/${signaturename}`;

      if (employee.signature_file !== null) {
        fs.unlinkSync(`public/signatures/${employee.signature_file}`);
      }

      await file.mv(`public/signatures/${signaturename}`);
    }

    await employee.update({
      ...req.body,
      image: filename,
      path_image: filepath,
      signature_file: signaturename,
      signature_path: signaturepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee)
      return res.status(404).json({ message: res.__("message.notFound") });

    if (employee.image !== "default.png") {
      fs.unlinkSync(`public/employees/${employee.image}`);
    }

    if (employee.signature_file !== null) {
      fs.unlinkSync(`public/signatures/${employee.signature_file}`);
    }

    await employee.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
