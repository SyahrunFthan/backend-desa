import { z } from "zod";

const facilityCreateSchema = z.object({
  name: z.string().nonempty("facility.required.name"),
  type_facility: z.string().nonempty("facility.required.type_facility"),
  status: z.string().nonempty("facility.required.status"),
  latitude: z.coerce
    .number({ required_error: "facility.required.latitude" })
    .min(-90, "facility.required.latitude")
    .max(90, "facility.required.latitude"),
  longitude: z.coerce
    .number({ required_error: "facility.required.longitude" })
    .min(-180, "facility.required.longitude")
    .max(180, "facility.required.longitude"),
});
const facilityUpdateSchema = z.object({
  name: z.string().nonempty("facility.required.name"),
  type_facility: z.string().nonempty("facility.required.type_facility"),
  status: z.string().nonempty("facility.required.status"),
  latitude: z.coerce
    .number({ required_error: "facility.required.latitude" })
    .min(-90, "facility.required.latitude")
    .max(90, "facility.required.latitude"),
  longitude: z.coerce
    .number({ required_error: "facility.required.longitude" })
    .min(-180, "facility.required.longitude")
    .max(180, "facility.required.longitude"),
});

export { facilityCreateSchema, facilityUpdateSchema };
