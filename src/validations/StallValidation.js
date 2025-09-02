import { z } from "zod";

export const stallCreateSchema = z.object({
  resident_id: z.uuidv4().nonempty("stall.required.resident_id"),
  category_id: z.uuidv4().nonempty("stall.required.category_id"),
  name: z.string().nonempty("stall.required.name"),
  price: z.number().min(1, "stall.required.price"),
  description: z.string().nonempty("stall.required.description"),
  phone_number: z.string().nonempty("stall.required.phone_number"),
  file: z.custom(
    (file) => {
      if (!file) return false;
      return true;
    },
    {
      message: "stall.required.file",
    }
  ),
});

export const stallUpdateSchema = z.object({
  resident_id: z.uuidv4().nonempty("stall.required.resident_id"),
  category_id: z.uuidv4().nonempty("stall.required.category_id"),
  name: z.string().nonempty("stall.required.name"),
  price: z.number().min(1, "stall.required.price"),
  description: z.string().nonempty("stall.required.description"),
  phone_number: z.string().nonempty("stall.required.phone_number"),
  status: z.string().nonempty("stall.required.status"),
});
