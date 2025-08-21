import { z } from "zod";

const developmentCreateSchema = z.object({
  name: z.string().nonempty("development.required.name"),
  location: z.string().nonempty("development.required.location"),
  volume: z.string().nonempty("development.required.volume"),
  budget: z.number().min(1, "development.required.budget"),
  source_of_fund: z.string().nonempty("development.required.source_of_fund"),
  latitude: z
    .number({ required_error: "development.required.latitude" })
    .min(-90, "Latitude minimal -90")
    .max(90, "Latitude maksimal 90"),
  longitude: z
    .number({ required_error: "development.required.longitude" })
    .min(-180, "Longitude minimal -180")
    .max(180, "Longitude maksimal 180"),
  start_at: z.string().nonempty("development.required.start_at"),
  end_at: z.string().nonempty("development.required.end_at"),
  status: z.string().nonempty("development.required.status"),
  year: z.number().min(1, "development.required.year"),
});

const developmentUpdateSchema = z.object({
  name: z.string().nonempty("development.required.name"),
  location: z.string().nonempty("development.required.location"),
  volume: z.string().nonempty("development.required.volume"),
  budget: z.number().min(1, "development.required.budget"),
  source_of_fund: z.string().nonempty("development.required.source_of_fund"),
  latitude: z
    .number({ required_error: "development.required.latitude" })
    .min(-90, "Latitude minimal -90")
    .max(90, "Latitude maksimal 90"),
  longitude: z
    .number({ required_error: "development.required.longitude" })
    .min(-180, "Longitude minimal -180")
    .max(180, "Longitude maksimal 180"),
  start_at: z.string().nonempty("development.required.start_at"),
  end_at: z.string().nonempty("development.required.end_at"),
  status: z.string().nonempty("development.required.status"),
  year: z.number().min(1, "development.required.year"),
});

export { developmentCreateSchema, developmentUpdateSchema };
