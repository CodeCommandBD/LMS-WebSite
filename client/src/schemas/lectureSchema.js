import { z } from "zod";

export const lectureSchema = z.object({
  lectureTitle: z.string().min(3, "Title must be at least 3 characters"),
  sectionName: z.string().optional(),
});
