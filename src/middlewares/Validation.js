import { ZodError } from "zod";

const humanizeField = (field) => {
  const cleaned = field.endsWith("_id") ? field.replace(/_id$/, "") : field;
  return cleaned.replace(/_/g, " ");
};

const Validation = (schema) => {
  return async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        ...req.query,
        ...req.params,
        ...req.files,
      };

      await schema.parseAsync(data);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = {};

        for (const issue of error.issues) {
          const field = issue.path[0];
          const simplifiedField = humanizeField(field);
          const translated = res.__(issue.message, { field: simplifiedField });
          errorMessages[field] = translated;
        }

        return res.status(400).json(errorMessages);
      }

      return res.status(500).json({ message: "Terjadi kesalahan validasi." });
    }
  };
};

export default Validation;
