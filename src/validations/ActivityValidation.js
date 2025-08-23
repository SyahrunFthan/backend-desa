import { z } from "zod";

const activityCreateSchema = z.object({
  name: z.string().nonempty("activity.required.name"),
  date_of_activity: z.string().nonempty("activity.required.date_of_activity"),
  location: z.string().nonempty("activity.required.location"),
});
const activityUpdateSchema = z.object({
  name: z.string().nonempty("activity.required.name"),
  date_of_activity: z.string().nonempty("activity.required.date_of_activity"),
  location: z.string().nonempty("activity.required.location"),
});

export { activityCreateSchema, activityUpdateSchema };
