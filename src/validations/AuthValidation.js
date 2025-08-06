import { z } from "zod";

const loginSchema = z.object({
  username: z.string().nonempty("validation.required"),
  password: z.string().nonempty("validation.required"),
});

export { loginSchema };
