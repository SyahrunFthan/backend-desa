import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().nonempty("news.required.title"),
  content: z.string().nonempty("news.required.content"),
  date_of_issue: z.string().nonempty("news.required.date_of_issue"),
  author: z.string().nonempty("news.required.author"),
  status: z.string().nonempty("news.required.status"),
});
