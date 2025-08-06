import { z } from "zod";
import Employee from "../models/Employee.js";
import { Op } from "sequelize";

const employeeCreateSchema = z
  .object({
    employee_id: z
      .string()
      .min(16, "employees.employee_id.min")
      .nonempty("employees.employee_id.required"),
    fullname: z.string().nonempty("employees.fullname.required"),
    gender: z.string().nonempty("employees.gender.required"),
    religion: z.string().nonempty("employees.religion.required"),
    place_of_birth: z.string().nonempty("employees.place_of_birth.required"),
    date_of_birth: z.string().nonempty("employees.date_of_birth.required"),
    is_structure: z.preprocess((val) => {
      if (val == "true") return true;
      if (val == "false") return false;
      return val;
    }, z.boolean("employees.is_structure.required")),
    position: z.string().optional(),
    level: z.string().nonempty("employees.level.required"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Employee.findOne({
      where: { employee_id: data.employee_id },
    });

    if (exists) {
      ctx.addIssue({
        path: ["employee_id"],
        code: "custom",
        message: "employees.employee_id.exists",
      });
    }

    if (data.position == "") {
      ctx.addIssue({
        path: ["position"],
        code: "custom",
        message: "employees.position.required",
      });

      ctx.addIssue({
        path: ["position_official"],
        code: "custom",
        message: "employees.position.required",
      });
    }
  });

const employeeUpdateSchema = z
  .object({
    employee_id: z
      .string()
      .min(16, "employees.employee_id.min")
      .nonempty("employees.employee_id.required"),
    fullname: z.string().nonempty("employees.fullname.required"),
    gender: z.string().nonempty("employees.gender.required"),
    religion: z.string().nonempty("employees.religion.required"),
    place_of_birth: z.string().nonempty("employees.place_of_birth.required"),
    date_of_birth: z.string().nonempty("employees.date_of_birth.required"),
    is_structure: z.preprocess((val) => {
      if (val == "true") return true;
      if (val == "false") return false;
      return val;
    }, z.boolean("employees.is_structure.required")),
    position: z.string().nonempty("employees.position.required"),
    level: z.string().nonempty("employees.level.required"),
    id: z.string().uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Employee.findOne({
      where: {
        employee_id: data.employee_id,
        id: {
          [Op.not]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["employee_id"],
        code: "custom",
        message: "employees.employee_id.exists",
      });
    }
  });

export { employeeCreateSchema, employeeUpdateSchema };
